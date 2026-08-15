/**
 * MCP fleet credential gating. Pure logic — no harness, no network.
 */

import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { SERVERS, partitionServers, resolveConfig } from '../src/servers.js'

/** Env with every credential present. */
const fullEnv = {
  SS_API_KEY: 'ss',
  BRAVE_API_KEY: 'brave',
  TAVILY_API_KEY: 'tavily',
  VAULT_ROOT: '/vault',
  APIFY_TOKEN: 'apify',
}

describe('MCP fleet', () => {
  it('mirrors the seven servers in mcp.example.json', () => {
    assert.deepEqual(
      SERVERS.map((s) => s.serverName),
      ['alphaxiv', 'keenable', 'semantic-scholar', 'brave-search', 'tavily-search', 'wiki-vault', 'apify'],
    )
  })

  it('keeps the two serverNames that skills reference literally', () => {
    const names = SERVERS.map((s) => s.serverName)
    assert.ok(names.includes('semantic-scholar'), 'mcp__semantic-scholar__* would break')
    assert.ok(names.includes('wiki-vault'), 'mcp__wiki-vault__* would break')
  })

  it('every serverName is a legal dsh namespace', () => {
    for (const { serverName } of SERVERS) {
      assert.match(serverName, /^[A-Za-z0-9_-]{1,32}$/, serverName)
    }
  })

  it('starts only the credential-free servers on an empty env', () => {
    const { ready, skipped } = partitionServers({})
    assert.deepEqual(ready.map((s) => s.serverName), ['alphaxiv', 'keenable'])
    assert.equal(skipped.length, 5)
  })

  it('starts the whole fleet when every credential is present', () => {
    const { ready, skipped } = partitionServers(fullEnv)
    assert.equal(ready.length, SERVERS.length)
    assert.deepEqual(skipped, [])
  })

  it('treats a blank credential as absent', () => {
    const { skipped } = partitionServers({ ...fullEnv, BRAVE_API_KEY: '   ' })
    assert.deepEqual(
      skipped.map(({ server, missing }) => [server.serverName, missing]),
      [['brave-search', ['BRAVE_API_KEY']]],
    )
  })

  it('never leaks an undefined credential into a config', () => {
    for (const server of SERVERS) {
      const config = resolveConfig(server, {})
      assert.equal(config.serverName, server.serverName)
      for (const value of Object.values(config.env ?? {})) {
        assert.notEqual(value, undefined)
      }
    }
  })

  it('injects present credentials only', () => {
    const config = resolveConfig(
      SERVERS.find((s) => s.serverName === 'wiki-vault'),
      { VAULT_ROOT: '/vault' },
    )
    assert.deepEqual(config.env, { VAULT_ROOT: '/vault' })
    assert.equal(config.transport, 'stdio')
  })

  it('omits env entirely for credential-free HTTP servers', () => {
    const config = resolveConfig(SERVERS.find((s) => s.serverName === 'alphaxiv'), fullEnv)
    assert.equal(config.env, undefined)
    assert.equal(config.transport, 'streamable-http')
  })
})
