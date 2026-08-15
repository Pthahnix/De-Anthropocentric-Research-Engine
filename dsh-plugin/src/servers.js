/**
 * MCP server fleet for the De-Anthropocentric Research Engine.
 *
 * Mirrors `mcp.example.json` at the repository root. Each ready entry becomes
 * one `@deepseek-ai/dsh-mcp-client` plugin instance.
 *
 * `serverName` is load-bearing: dsh registers tools as
 * `mcp__<serverName>__<rawName>`, and four shipped skills reference
 * `mcp__semantic-scholar__*` / `mcp__wiki-vault__*` literally. Renaming those
 * two servers silently breaks those skills.
 *
 * `requiredEnv` lists credentials the server cannot start without. A server
 * missing any of them is skipped with a warning rather than registering zero
 * tools, so an unconfigured fleet is visible instead of silently inert.
 *
 * @module @yogsoth-ai/dare-dsh/servers
 */

/**
 * @typedef {object} ServerSpec
 * @property {string} serverName Tool-name namespace; must match skill references.
 * @property {readonly string[]} requiredEnv Env vars whose absence disables this server.
 * @property {Record<string, unknown>} base Transport config without resolved credentials.
 */

/** @type {readonly ServerSpec[]} */
export const SERVERS = [
  {
    serverName: 'alphaxiv',
    requiredEnv: [],
    base: { transport: 'streamable-http', url: 'https://api.alphaxiv.org/mcp/v1' },
  },
  {
    serverName: 'keenable',
    requiredEnv: [],
    base: { transport: 'streamable-http', url: 'https://api.keenable.ai/mcp' },
  },
  {
    serverName: 'semantic-scholar',
    requiredEnv: ['SS_API_KEY'],
    base: { transport: 'stdio', command: 'npx', args: ['-y', '@yogsoth-ai/semantic-scholar-mcp'] },
  },
  {
    serverName: 'brave-search',
    requiredEnv: ['BRAVE_API_KEY'],
    base: { transport: 'stdio', command: 'npx', args: ['-y', '@brave/brave-search-mcp-server@latest'] },
  },
  {
    serverName: 'tavily-search',
    requiredEnv: ['TAVILY_API_KEY'],
    base: { transport: 'stdio', command: 'npx', args: ['-y', 'tavily-mcp@latest'] },
  },
  {
    serverName: 'wiki-vault',
    requiredEnv: ['VAULT_ROOT'],
    base: { transport: 'stdio', command: 'npx', args: ['-y', '@yogsoth-ai/wiki-vault'] },
  },
  {
    serverName: 'apify',
    requiredEnv: ['APIFY_TOKEN'],
    base: {
      transport: 'stdio',
      command: 'npx',
      args: [
        '-y',
        '@apify/actors-mcp-server',
        '--telemetry-enabled=false',
        '--tools',
        'fetch-actor-details,get-actor-output,get-dataset-items,get-dataset-schema,apify/rag-web-browser',
      ],
    },
  },
]

/**
 * Whether an environment value counts as present.
 * @param {string | undefined} value Raw environment value.
 * @returns {boolean} True when the value is a non-blank string.
 */
const isPresent = (value) => typeof value === 'string' && value.trim() !== ''

/**
 * Build the `dsh-mcp-client` config for one server, injecting only credentials
 * that are actually present so no `undefined` reaches the plugin schema.
 * @param {ServerSpec} server Server whose config to resolve.
 * @param {NodeJS.ProcessEnv} env Environment to read credentials from.
 * @returns {Record<string, unknown>} Config accepted by `dsh-mcp-client`.
 */
export function resolveConfig(server, env) {
  const config = { serverName: server.serverName, ...server.base }
  const credentials = {}
  for (const key of server.requiredEnv) {
    if (isPresent(env[key])) credentials[key] = env[key]
  }
  if (Object.keys(credentials).length > 0) config.env = credentials
  return config
}

/**
 * Split the fleet into startable servers and those missing credentials.
 * @param {NodeJS.ProcessEnv} env Environment to resolve credentials against.
 * @param {readonly ServerSpec[]} [servers] Fleet to partition; defaults to {@link SERVERS}.
 * @returns {{ ready: ServerSpec[], skipped: Array<{ server: ServerSpec, missing: string[] }> }} Partitioned fleet.
 */
export function partitionServers(env, servers = SERVERS) {
  const ready = []
  const skipped = []
  for (const server of servers) {
    const missing = server.requiredEnv.filter((key) => !isPresent(env[key]))
    if (missing.length > 0) skipped.push({ server, missing })
    else ready.push(server)
  }
  return { ready, skipped }
}
