import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { clearCache, fetchProfile, GitHubError } from './githubApi'
import { repo, user } from '../test/fixtures'

const original = globalThis.fetch
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers })

beforeEach(() => clearCache())
afterEach(() => { globalThis.fetch = original })

describe('fetchProfile', () => {
  it('retorna usuário e repositórios e marca truncamento', async () => {
    globalThis.fetch = (async (url: RequestInfo | URL) =>
      String(url).includes('/repos') ? json([repo({ id: 1 })]) : json(user({ public_repos: 250 }))) as typeof fetch
    const data = await fetchProfile('alice')
    expect(data.repos).toHaveLength(1)
    expect(data.truncated).toBe(true)
  })
  it('usa cache em memória para consultas repetidas', async () => {
    let calls = 0
    globalThis.fetch = (async (url: RequestInfo | URL) => {
      calls++
      return String(url).includes('/repos') ? json([]) : json(user({ public_repos: 0 }))
    }) as typeof fetch
    await fetchProfile('alice'); await fetchProfile('ALICE')
    expect(calls).toBe(2)
  })
  it('traduz 404 em usuário inexistente', async () => {
    globalThis.fetch = (async () => json({ message: 'Not Found' }, 404)) as typeof fetch
    await expect(fetchProfile('ghost')).rejects.toMatchObject({ kind: 'not_found' })
  })
  it('traduz 403 sem cota restante em limite de requisições', async () => {
    globalThis.fetch = (async () => json({}, 403, { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': '1800000000' })) as typeof fetch
    await expect(fetchProfile('alice')).rejects.toMatchObject({ kind: 'rate_limit' })
  })
  it('traduz falha de rede', async () => {
    globalThis.fetch = (async () => { throw new TypeError('fail') }) as typeof fetch
    const err = await fetchProfile('alice').catch((e: unknown) => e)
    expect(err instanceof GitHubError && err.kind).toBe('network')
  })
})
