/**
 * DeepSeek Harness plugin for the De-Anthropocentric Research Engine.
 *
 * Contributes the bundled DARE library as one `ctx.skills` provider named
 * `dare`, at bundled rank so a user's own same-named skill always wins.
 * Parsing, kebab-case validation, and `resourceBase` resolution are delegated
 * to `@deepseek-ai/dsh-skill-filesystem`; nothing here reparses `SKILL.md`.
 * Relative `prompt.md` references in 385 skills resolve through that
 * provider's directory resource base.
 *
 * The MCP server fleet is a separate opt-in entry point, `./mcp`, so this
 * plugin loads with no MCP package installed.
 *
 * @module @yogsoth-ai/dare-dsh
 */

import { fileURLToPath } from 'node:url'
import * as fsSkills from '@deepseek-ai/dsh-skill-filesystem'

/** Absolute path to the bundled skill library. */
export const SKILLS_DIR = fileURLToPath(new URL('../payload/skills/', import.meta.url))

/** Provider name registered on `ctx.skills`. */
export const PROVIDER_NAME = 'dare'

/** Cordis plugin name. */
export const name = 'dare'

/** Services required before `apply` runs. */
export const inject = ['skills']

/**
 * Register the bundled DARE skill library on `ctx.skills`.
 *
 * `includeDefaultRoots: false` keeps this provider to its own root so it never
 * shadows or duplicates the host's own project and user skill discovery.
 * `watch: false` because a published payload is immutable.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx Plugin context.
 * @returns {void}
 */
export function apply(ctx) {
  ctx.plugin(fsSkills, {
    providerName: PROVIDER_NAME,
    includeDefaultRoots: false,
    bundledSkillDir: SKILLS_DIR,
    watch: false,
  })
}

export default { name, inject, apply }
