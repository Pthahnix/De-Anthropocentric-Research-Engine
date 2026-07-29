$ErrorActionPreference = "Stop"

$RequiredRootSkill = Join-Path "de-anthropocentric-research-engine" "SKILL.md"
$RequiredCatalogSkill = Join-Path "research-catalog" "SKILL.md"
$AgentsBegin = "<!-- BEGIN DARE RESEARCH ENGINE -->"
$AgentsEnd = "<!-- END DARE RESEARCH ENGINE -->"

function Show-Usage {
@"
Usage: ./install/codex.ps1 [options]

Install DARE project instructions and its skills knowledge base into a target project.

Options:
  --target <dir>   Project directory to install into (default: current directory)
  --copy           Copy the DARE skills knowledge base into .dare/skills
  --link           Symlink .dare/skills to this clone's skills directory
  --dry-run        Show what would change without writing files
  -h, --help       Show this help

The installer creates or updates a managed DARE block in AGENTS.md. Default
behavior copies the knowledge base so the target still works if this clone is
removed.
"@
}

function Stop-WithUsage([string]$Message) {
  [Console]::Error.WriteLine("dare-codex-install: $Message")
  [Console]::Error.WriteLine("")
  [Console]::Error.WriteLine((Show-Usage))
  exit 1
}

function Get-ResolvedPathOrNull([string]$Path) {
  $item = Resolve-Path -LiteralPath $Path -ErrorAction SilentlyContinue
  if ($null -eq $item) {
    return $null
  }
  return $item.ProviderPath
}

function Test-SamePath([string]$Left, [string]$Right) {
  $resolvedLeft = Get-ResolvedPathOrNull $Left
  $resolvedRight = Get-ResolvedPathOrNull $Right
  if ($null -eq $resolvedLeft -or $null -eq $resolvedRight) {
    return $false
  }
  if ([System.IO.Path]::DirectorySeparatorChar -eq '\') {
    return [string]::Equals($resolvedLeft, $resolvedRight, [System.StringComparison]::OrdinalIgnoreCase)
  }
  return [string]::Equals($resolvedLeft, $resolvedRight, [System.StringComparison]::Ordinal)
}

function Assert-DareSkillsRoot([string]$Root) {
  $rootSkill = Join-Path $Root $RequiredRootSkill
  $catalogSkill = Join-Path $Root $RequiredCatalogSkill
  if (-not (Test-Path -LiteralPath $rootSkill -PathType Leaf)) {
    Stop-WithUsage "Existing skills root is not a DARE skills tree: missing $rootSkill"
  }
  if (-not (Test-Path -LiteralPath $catalogSkill -PathType Leaf)) {
    Stop-WithUsage "Existing skills root is not a DARE skills tree: missing $catalogSkill"
  }
}

function Copy-Skills([string]$Source, [string]$Dest) {
  $parent = Split-Path -Parent $Dest
  New-Item -ItemType Directory -Force -Path $parent | Out-Null
  Copy-Item -LiteralPath $Source -Destination $parent -Recurse
}

function Get-MarkerCount([string]$Path, [string]$Marker) {
  $lines = [System.IO.File]::ReadAllLines($Path)
  return @($lines | Where-Object { $_ -eq $Marker }).Count
}

function Get-DareAgentsBlock([string]$Path) {
  $content = [System.IO.File]::ReadAllText($Path)
  $pattern = "(?ms)^$([regex]::Escape($AgentsBegin))\r?\n.*?^$([regex]::Escape($AgentsEnd))\r?(?:\n|$)"
  $matches = [regex]::Matches($content, $pattern)
  if ($matches.Count -ne 1) {
    Stop-WithUsage "Expected exactly one complete DARE block in $Path"
  }
  return $matches[0].Value.TrimEnd("`r", "`n") + [Environment]::NewLine
}

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

$TargetDir = (Get-Location).Path
$Mode = "copy"
$DryRun = $false

for ($i = 0; $i -lt $args.Count; $i++) {
  switch ($args[$i]) {
    "--target" {
      $i++
      if ($i -ge $args.Count) {
        Stop-WithUsage "--target requires a directory"
      }
      $TargetDir = $args[$i]
    }
    "--copy" { $Mode = "copy" }
    "--link" { $Mode = "link" }
    "--dry-run" { $DryRun = $true }
    "-h" {
      Show-Usage
      exit 0
    }
    "--help" {
      Show-Usage
      exit 0
    }
    default {
      Stop-WithUsage "Unknown option: $($args[$i])"
    }
  }
}

if ($Mode -notin @("copy", "link")) {
  Stop-WithUsage "Invalid mode: $Mode"
}

if (-not (Test-Path -LiteralPath $TargetDir -PathType Container)) {
  Stop-WithUsage "Target directory does not exist: $TargetDir"
}

$TargetDir = (Resolve-Path -LiteralPath $TargetDir).ProviderPath
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = (Resolve-Path -LiteralPath (Join-Path $ScriptDir "..")).ProviderPath
$SourceAgents = Join-Path $RepoRoot "AGENTS.md"
$SourceSkills = Join-Path $RepoRoot "skills"

if (-not (Test-Path -LiteralPath $SourceAgents -PathType Leaf)) {
  Stop-WithUsage "DARE project instructions not found at $SourceAgents"
}
if ((Get-MarkerCount $SourceAgents $AgentsBegin) -ne 1 -or (Get-MarkerCount $SourceAgents $AgentsEnd) -ne 1) {
  Stop-WithUsage "Expected exactly one DARE begin marker and one DARE end marker in $SourceAgents"
}
Assert-DareSkillsRoot $SourceSkills

$AgentsBlock = Get-DareAgentsBlock $SourceAgents
$AgentsPath = Join-Path $TargetDir "AGENTS.md"
$AgentsStatus = "created"
$AgentsCandidate = $AgentsBlock

if (Test-Path -LiteralPath $AgentsPath) {
  if (-not (Test-Path -LiteralPath $AgentsPath -PathType Leaf)) {
    Stop-WithUsage "AGENTS.md exists but is not a regular file: $AgentsPath"
  }

  $existingAgents = [System.IO.File]::ReadAllText($AgentsPath)
  $targetBeginCount = Get-MarkerCount $AgentsPath $AgentsBegin
  $targetEndCount = Get-MarkerCount $AgentsPath $AgentsEnd

  if ($targetBeginCount -eq 0 -and $targetEndCount -eq 0) {
    $trimmed = $existingAgents.TrimEnd("`r", "`n")
    if ($trimmed.Length -eq 0) {
      $AgentsCandidate = $AgentsBlock
    } else {
      $AgentsCandidate = $trimmed + [Environment]::NewLine + [Environment]::NewLine + $AgentsBlock
    }
    $AgentsStatus = "appended"
  } elseif ($targetBeginCount -eq 1 -and $targetEndCount -eq 1) {
    $pattern = "(?ms)^$([regex]::Escape($AgentsBegin))\r?\n.*?^$([regex]::Escape($AgentsEnd))\r?(?:\n|$)"
    $matches = [regex]::Matches($existingAgents, $pattern)
    if ($matches.Count -ne 1) {
      Stop-WithUsage "Malformed DARE block in $AgentsPath: the end marker must follow the begin marker"
    }
    $AgentsCandidate = $existingAgents.Substring(0, $matches[0].Index) + $AgentsBlock + $existingAgents.Substring($matches[0].Index + $matches[0].Length)
    if ([string]::Equals($AgentsCandidate, $existingAgents, [System.StringComparison]::Ordinal)) {
      $AgentsStatus = "unchanged"
    } else {
      $AgentsStatus = "updated"
    }
  } else {
    Stop-WithUsage "Malformed DARE block in $AgentsPath: expected one begin marker and one end marker"
  }
}

if ($DryRun) {
  switch ($AgentsStatus) {
    "created" { $AgentsStatus = "would-create" }
    "appended" { $AgentsStatus = "would-append" }
    "updated" { $AgentsStatus = "would-update" }
  }
} elseif ($AgentsStatus -ne "unchanged") {
  Write-Utf8NoBom $AgentsPath $AgentsCandidate
}

$SkillsPath = $SourceSkills
$SkillsStatus = "using-repo-skills"
$SkillsSource = $null
$LinkFallbackReason = $null

if (-not (Test-SamePath $RepoRoot $TargetDir)) {
  $DestSkills = Join-Path (Join-Path $TargetDir ".dare") "skills"
  $SkillsPath = $DestSkills

  if (Test-Path -LiteralPath $DestSkills) {
    if (-not (Test-Path -LiteralPath $DestSkills -PathType Container)) {
      Stop-WithUsage "Existing DARE skills path is not a directory: $DestSkills"
    }
    Assert-DareSkillsRoot $DestSkills
    if (Test-SamePath $SourceSkills $DestSkills) {
      $SkillsStatus = "linked-existing"
    } else {
      $SkillsStatus = "existing-dare-skills"
    }
  } elseif ($DryRun) {
    if ($Mode -eq "link") {
      $SkillsStatus = "would-link"
    } else {
      $SkillsStatus = "would-copy"
    }
  } elseif ($Mode -eq "copy") {
    Copy-Skills $SourceSkills $DestSkills
    $SkillsStatus = "copied"
  } else {
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $DestSkills) | Out-Null
    try {
      $itemType = "SymbolicLink"
      if ([System.IO.Path]::DirectorySeparatorChar -eq '\') {
        $itemType = "Junction"
      }
      New-Item -ItemType $itemType -Path $DestSkills -Target $SourceSkills | Out-Null
      $SkillsStatus = "linked"
      $SkillsSource = $SourceSkills
    } catch {
      if ($Mode -eq "link") {
        Stop-WithUsage "Could not create symlink $DestSkills -> $SourceSkills: $($_.Exception.Message)"
      }
      Copy-Skills $SourceSkills $DestSkills
      $SkillsStatus = "copied-fallback"
      $LinkFallbackReason = $_.Exception.Message
    }
  }
}

Write-Output "dare-codex-install:"
if ($DryRun) {
  Write-Output "  dry_run: true"
}
Write-Output "  repo: $RepoRoot"
Write-Output "  target: $TargetDir"
Write-Output "  agents: $AgentsStatus $AgentsPath"
Write-Output "  skills: $SkillsStatus $SkillsPath"
if ($null -ne $SkillsSource) {
  Write-Output "  skills_source: $SkillsSource"
}
if ($null -ne $LinkFallbackReason) {
  Write-Output "  link_fallback_reason: $LinkFallbackReason"
}
Write-Output "  entry: AGENTS.md -> DARE skill root"
Write-Output "  mcp: not configured by this installer"
