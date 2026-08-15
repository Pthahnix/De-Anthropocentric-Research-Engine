/**
 * Regenerate `payload/skills` from the repository skill library.
 *
 * Mirrors `cli/scripts/build.js`. Runs on `prepublishOnly` so a published
 * tarball always carries the library that matched its commit; `payload/` is
 * gitignored and never hand-edited.
 *
 * @module scripts/build
 */

import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Copy the skill library into the plugin payload.
 * @param {string} repoRoot Repository root holding `skills/`.
 * @param {string} outDir Payload directory to regenerate.
 * @returns {number} Number of skill directories copied.
 */
export function build(repoRoot, outDir) {
  const source = join(repoRoot, 'skills')
  const target = join(outDir, 'skills')
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })
  cpSync(source, target, { recursive: true })
  return readdirSync(target, { withFileTypes: true }).filter((entry) => entry.isDirectory()).length
}

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, '..', 'payload')
const count = build(join(here, '..', '..'), outDir)
process.stdout.write(`build: ${count} skills staged at ${outDir}\n`)
