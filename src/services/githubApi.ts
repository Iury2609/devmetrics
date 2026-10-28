import type { ErrorKind, GitHubRepo, GitHubUser, ProfileData } from '../types/github'

const BASE = 'https://api.github.com'
const TTL_MS = 5 * 60 * 1000
const TIMEOUT_MS = 15_000

export class GitHubError extends Error {
  constructor(public kind: ErrorKind, message: string, public resetAt?: Date) {
    super(message)
    this.name = 'GitHubError'
  }
}

const cache = new Map<string, { at: number; data: ProfileData }>()
export const clearCache = (): void => cache.clear()

function isUser(v: unknown): v is GitHubUser {
  const u = v as Partial<GitHubUser> | null
  return !!u && typeof u.login === 'string' && typeof u.avatar_url === 'string' && typeof u.public_repos === 'number'
}

function isRepo(v: unknown): v is GitHubRepo {
  const r = v as Partial<GitHubRepo> | null
  return !!r && typeof r.id === 'number' && typeof r.name === 'string' && typeof r.updated_at === 'string'
}

async function request(path: string, signal?: AbortSignal): Promise<unknown> {
  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(), TIMEOUT_MS)
  const onAbort = () => timeout.abort()
  signal?.addEventListener('abort', onAbort)
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: timeout.signal,
    })
    if (res.status === 404) throw new GitHubError('not_found', 'Usuário não encontrado no GitHub.')
    const remaining = res.headers.get('x-ratelimit-remaining')
    if (res.status === 429 || (res.status === 403 && remaining === '0')) {
      const reset = Number(res.headers.get('x-ratelimit-reset'))
      const resetAt = reset ? new Date(reset * 1000) : undefined
      const when = resetAt ? ` Tente novamente após ${resetAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.` : ''
      throw new GitHubError('rate_limit', `Limite de requisições da API do GitHub atingido.${when}`, resetAt)
    }
    if (!res.ok) throw new GitHubError('http', `A API do GitHub respondeu com erro ${res.status}.`)
    return await res.json()
  } catch (e) {
    if (e instanceof GitHubError) throw e
    if (signal?.aborted) throw e
    if (timeout.signal.aborted) throw new GitHubError('timeout', 'A consulta demorou demais. Tente novamente.')
    throw new GitHubError('network', 'Não foi possível acessar a API do GitHub. Verifique sua conexão.')
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}

export async function fetchProfile(username: string, signal?: AbortSignal): Promise<ProfileData> {
  const key = username.toLowerCase()
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data

  const name = encodeURIComponent(username)
  const [rawUser, rawRepos] = await Promise.all([
    request(`/users/${name}`, signal),
    request(`/users/${name}/repos?sort=updated&per_page=100`, signal),
  ])
  if (!isUser(rawUser) || !Array.isArray(rawRepos)) throw new GitHubError('invalid', 'Resposta inesperada da API do GitHub.')

  const repos = rawRepos.filter(isRepo)
  const data: ProfileData = {
    user: rawUser,
    repos,
    truncated: rawUser.public_repos > repos.length,
    fetchedAt: new Date().toISOString(),
  }
  cache.set(key, { at: Date.now(), data })
  return data
}
