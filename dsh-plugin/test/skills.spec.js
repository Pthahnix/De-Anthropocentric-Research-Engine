/**
 * Layer-2 verification: the real `ctx.skills` registry, the real filesystem
 * provider, the real bundled payload. No model, no API key, no dsh CLI.
 *
 * What this proves: every bundled skill is discoverable through the same
 * registry a live harness reads, at the rank and provider we claim, with
 * loadable bodies and a resource base that resolves relative `prompt.md`.
 */

import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { after, before, describe, it } from 'node:test'
import { Context } from '@deepseek-ai/cordis'
import SkillRegistry, { BUNDLED_SKILL_RANK, isModelInvocable } from '@deepseek-ai/dsh-skill'
import darePlugin, { PROVIDER_NAME, SKILLS_DIR } from '../src/index.js'

/** Skill directories present in the staged payload. */
const payloadNames = readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

describe('dare skill provider', () => {
  /** @type {Context} */
  let ctx
  /** @type {import('@deepseek-ai/dsh-skill').SkillSummary[]} */
  let skills
  /** @type {{ skills: unknown[], complete: boolean }} */
  let snapshot

  before(async () => {
    ctx = new Context()
    await ctx.plugin(SkillRegistry)
    await ctx.plugin(darePlugin)
    snapshot = await ctx.skills.snapshot()
    skills = await ctx.skills.list()
  })

  after(async () => {
    await ctx.fiber?.dispose?.()
  })

  it('payload is non-empty', () => {
    assert.ok(payloadNames.length > 900, `expected >900 staged skills, got ${payloadNames.length}`)
  })

  it('discovers every staged skill', () => {
    assert.equal(skills.length, payloadNames.length)
    assert.deepEqual([...skills.map((s) => s.name)].sort(), [...payloadNames].sort())
  })

  it('reports a complete snapshot', () => {
    assert.equal(snapshot.complete, true)
  })

  it('attributes every skill to this provider at bundled rank', async () => {
    for (const skill of skills) {
      assert.equal(skill.provider, PROVIDER_NAME, `${skill.name} provider`)
      assert.equal(skill.source, 'bundled', `${skill.name} source`)
    }
    assert.equal(BUNDLED_SKILL_RANK, 600)
  })

  it('exposes every skill to the model', () => {
    const hidden = skills.filter((skill) => !isModelInvocable(skill))
    assert.deepEqual(hidden, [], 'no skill should be hidden from the model catalog')
  })

  it('loads a full body with a directory resource base', async () => {
    const definition = await ctx.skills.get('abductive-hypothesis-generation')
    assert.ok(definition, 'skill should load')
    assert.ok(definition.content.length > 0, 'body should be non-empty')
    assert.equal(definition.resourceBase?.kind, 'directory')
    assert.ok(
      existsSync(join(definition.resourceBase.path, 'prompt.md')),
      'relative prompt.md must resolve through resourceBase',
    )
  })

  it('loads the four skills that name MCP tools literally', async () => {
    const names = [
      'convergence-portfolio-optimization',
      'pairwise-ranking',
      'steel-manning',
      'structured-consensus',
    ]
    for (const name of names) {
      const definition = await ctx.skills.get(name)
      assert.ok(definition, `${name} should load`)
      assert.match(definition.content, /mcp__/, `${name} should retain its MCP tool names`)
    }
  })

  it('every skill body loads', async () => {
    const failures = []
    for (const skill of skills) {
      const definition = await ctx.skills.get(skill.name)
      if (!definition || definition.content.trim() === '') failures.push(skill.name)
    }
    assert.deepEqual(failures, [], 'every skill must return a non-empty body')
  })

  it('reports catalog weight and descriptions the consumer will truncate', () => {
    const bytes = skills.reduce((sum, s) => sum + s.name.length + s.description.length, 0)
    // `dsh-tool-skill` truncates each catalog description at its
    // `catalogDescriptionMaxLength` (default 500). Skills listed here lose
    // their tail in the model-facing catalog; their bodies are unaffected.
    // Fixing one means editing the upstream `skills/<name>/SKILL.md`.
    const truncated = skills.filter((s) => s.description.length > 500).map((s) => s.name)
    assert.deepEqual(truncated, ['mechanism-gap-hunting'], 'known over-cap set changed')
    process.stdout.write(`\n  catalog: ${skills.length} skills, ${bytes} bytes name+description\n`)
  })
})
