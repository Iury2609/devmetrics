import { describe, expect, it } from 'vitest'
import { compareProfiles, countRecent, distinctLanguages, filterRepos, languageDistribution, sortRepos, sumForks, sumStars } from './analytics'
import { NOW, profile, repo } from '../test/fixtures'

const repos = [
  repo({ id: 1, language: 'TypeScript', stargazers_count: 10, forks_count: 2, updated_at: '2026-10-20T00:00:00Z', description: 'Dashboard' }),
  repo({ id: 2, language: 'TypeScript', stargazers_count: 5, forks_count: 7, updated_at: '2026-01-01T00:00:00Z' }),
  repo({ id: 3, language: null, stargazers_count: 0, forks_count: 0, updated_at: '2026-10-01T00:00:00Z' }),
  repo({ id: 4, language: 'Go', stargazers_count: 1, forks_count: 1, updated_at: '2025-01-01T00:00:00Z' }),
]

describe('analytics', () => {
  it('soma estrelas e forks', () => {
    expect(sumStars(repos)).toBe(16)
    expect(sumForks(repos)).toBe(10)
  })
  it('agrupa por linguagem tratando ausência como "Não definida"', () => {
    const d = languageDistribution(repos)
    expect(d[0]).toEqual({ name: 'TypeScript', count: 2, percent: 50 })
    expect(d.find((s) => s.name === 'Não definida')?.count).toBe(1)
    expect(languageDistribution([])).toEqual([])
  })
  it('conta linguagens distintas ignorando repositórios sem linguagem', () => expect(distinctLanguages(repos)).toBe(2))
  it('calcula atividade recente em 30 dias', () => expect(countRecent(repos, 30, NOW)).toBe(2))
  it('ordena sem alterar a lista original', () => {
    expect(sortRepos(repos, 'stars').map((r) => r.id)).toEqual([1, 2, 4, 3])
    expect(sortRepos(repos, 'forks')[0].id).toBe(2)
    expect(sortRepos(repos, 'updated')[0].id).toBe(1)
    expect(repos[0].id).toBe(1)
  })
  it('filtra por texto e linguagem', () => {
    expect(filterRepos(repos, { query: 'dash' }).map((r) => r.id)).toEqual([1])
    expect(filterRepos(repos, { language: 'Go' }).map((r) => r.id)).toEqual([4])
    expect(filterRepos(repos, { language: 'Não definida' }).map((r) => r.id)).toEqual([3])
    expect(filterRepos(repos, { query: 'inexistente' })).toHaveLength(0)
  })
  it('compara dois perfis com líder e diferença absoluta', () => {
    const a = profile({ login: 'a', followers: 10 }, repos)
    const b = profile({ login: 'b', followers: 30 }, repos.slice(0, 1))
    const m = Object.fromEntries(compareProfiles(a, b, NOW).map((x) => [x.key, x]))
    expect(m.followers).toMatchObject({ leader: 'b', diff: 20, limited: false })
    expect(m.stars).toMatchObject({ leader: 'a', diff: 6, limited: true })
    expect(m.following.leader).toBe('tie')
  })
})
