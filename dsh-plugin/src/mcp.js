/**
 * Opt-in MCP fleet for the De-Anthropocentric Research Engine.
 *
 * Mounts one `@deepseek-ai/dsh-mcp-client` instance per research server,
 * skipping any server whose credentials are absent. Kept out of the package
 * entry point so the skill library loads with no MCP package installed;
 * mounting this module is what makes `@deepseek-ai/dsh-mcp-client` required.
 *
 * @module @yogsoth-ai/dare-dsh/mcp
 */

import mcpClient from '@deepseek-ai/dsh-mcp-client'
import { partitionServers, resolveConfig } from './servers.js'

/** Cordis plugin name. */
export const name = 'dare-mcp'

/** Services required before `apply` runs. */
export const inject = ['tools']

/**
 * @typedef {object} Config
 * @property {string[]} [only] Restrict the fleet to these `serverName`s.
 * @property {string[]} [exclude] Drop these `serverName`s from the fleet.
 */

/**
 * Mount every research MCP server whose credentials are present.
 *
 * A server missing credentials is reported once at load rather than
 * registering zero tools, so an unconfigured fleet is visible instead of
 * silently inert.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx Plugin context.
 * @param {Config} [config] Plugin configuration.
 * @returns {void}
 */
export function apply(ctx, config = {}) {
  const { only, exclude } = config
  const selected = (serverName) => {
    if (only && !only.includes(serverName)) return false
    if (exclude && exclude.includes(serverName)) return false
    return true
  }

  const { ready, skipped } = partitionServers(process.env)

  for (const server of ready) {
    if (selected(server.serverName)) ctx.plugin(mcpClient, resolveConfig(server, process.env))
  }

  for (const { server, missing } of skipped) {
    if (!selected(server.serverName)) continue
    ctx.logger?.warn(
      `dare-mcp: skipping "${server.serverName}" — missing ${missing.join(', ')}. ` +
        'Skills depending on it will have no tools.',
    )
  }
}

export default { name, inject, apply }
