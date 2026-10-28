import type { GitHubRepo, ProfileData } from '../types/github'

export const RECENT_DAYS = 30
export const NO_LANGUAGE = 'Não definida'

export const sumStars = (repos: GitHubRepo[]): number => repos.reduce((s, r) => s + r.stargazers_count, 0)
export const sumForks = (repos: GitHubRepo[]): number => repos.reduce((s, r) => s + r.forks_count, 0)

export function countRecent(repos: GitHubRepo[], days = RECENT_DAYS, now: Date = new Date()): number {
  const limit = now.getTime() - days * 86_400_000
  return repos.filter((r) => new Date(r.updated_at).getTime() >= limit).length
}

export interface LanguageSlice { name: string; count: number; percent: number }

export function languageDistribution(repos: GitHubRepo[]): LanguageSlice[] {
  if (repos.length === 0) return []
  const counts = new Map<string, number>()
  for (const r of repos) {
    const key = r.language ?? NO_LANGUAGE
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, percent: (count / repos.length) * 100 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export const distinctLanguages = (repos: GitHubRepo[]): number =>
  new Set(repos.map((r) => r.language).filter((l): l is string => Boolean(l))).size

export type SortKey = 'updated' | 'stars' | 'forks'

export function sortRepos(repos: GitHubRepo[], key: SortKey): GitHubRepo[] {
  const by: Record<SortKey, (r: GitHubRepo) => number> = {
    updated: (r) => new Date(r.updated_at).getTime(),
    stars: (r) => r.stargazers_count,
    forks: (r) => r.forks_count,
  }
  return [...repos].sort((a, b) => by[key](b) - by[key](a))
}

export function filterRepos(repos: GitHubRepo[], opts: { query?: string; language?: string }): GitHubRepo[] {
  const q = (opts.query ?? '').trim().toLowerCase()
  return repos.filter((r) => {
    if (opts.language && (r.language ?? NO_LANGUAGE) !== opts.language) return false
    if (!q) return true
    return r.name.toLowerCase().includes(q) || (r.description ?? '').toLowerCase().includes(q)
  })
}

export const topByStars = (repos: GitHubRepo[], n = 5): GitHubRepo[] => sortRepos(repos, 'stars').slice(0, n)

export interface Metric { key: string; label: string; a: number; b: number; diff: number; leader: 'a' | 'b' | 'tie'; limited: boolean }

export function compareProfiles(a: ProfileData, b: ProfileData, now: Date = new Date()): Metric[] {
  const rows: Array<[string, string, number, number, boolean]> = [
    ['followers', 'Seguidores', a.user.followers, b.user.followers, false],
    ['following', 'Pessoas seguidas', a.user.following, b.user.following, false],
    ['repos', 'Repositórios públicos', a.user.public_repos, b.user.public_repos, false],
    ['stars', 'Estrelas acumuladas', sumStars(a.repos), sumStars(b.repos), true],
    ['forks', 'Forks acumulados', sumForks(a.repos), sumForks(b.repos), true],
    ['languages', 'Linguagens principais distintas', distinctLanguages(a.repos), distinctLanguages(b.repos), true],
    ['recent', `Repositórios atualizados em ${RECENT_DAYS} dias`, countRecent(a.repos, RECENT_DAYS, now), countRecent(b.repos, RECENT_DAYS, now), true],
  ]
  return rows.map(([key, label, x, y, limited]) => ({
    key, label, a: x, b: y, diff: Math.abs(x - y), leader: x === y ? 'tie' : x > y ? 'a' : 'b', limited,
  }))
}
