import { useMemo, useState } from 'react'
import { Archive, GitFork, Star } from 'lucide-react'
import type { GitHubRepo } from '../../types/github'
import { filterRepos, NO_LANGUAGE, sortRepos, type SortKey } from '../../utils/analytics'
import { formatDate, formatNumber } from '../../utils/formatters'

const PAGE = 12

export function RepoList({ repos }: { repos: GitHubRepo[] }) {
  const [query, setQuery] = useState('')
  const [language, setLanguage] = useState('')
  const [sort, setSort] = useState<SortKey>('updated')
  const [visible, setVisible] = useState(PAGE)

  const languages = useMemo(() => [...new Set(repos.map((r) => r.language ?? NO_LANGUAGE))].sort(), [repos])
  const items = useMemo(() => sortRepos(filterRepos(repos, { query, language }), sort), [repos, query, language, sort])

  return (
    <section aria-labelledby="repos-title">
      <h2 id="repos-title" className="mb-3 text-lg font-semibold">Repositórios</h2>
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <label className="sr-only" htmlFor="repo-q">Buscar por nome ou descrição</label>
        <input id="repo-q" className="field" placeholder="Buscar por nome ou descrição" value={query} onChange={(e) => { setQuery(e.target.value); setVisible(PAGE) }} />
        <label className="sr-only" htmlFor="repo-lang">Filtrar por linguagem</label>
        <select id="repo-lang" className="field" value={language} onChange={(e) => { setLanguage(e.target.value); setVisible(PAGE) }}>
          <option value="">Todas as linguagens</option>
          {languages.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <label className="sr-only" htmlFor="repo-sort">Ordenar por</label>
        <select id="repo-sort" className="field" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
          <option value="updated">Atualização mais recente</option>
          <option value="stars">Mais estrelas</option>
          <option value="forks">Mais forks</option>
        </select>
      </div>
      {items.length === 0 ? (
        <p className="card p-8 text-center text-sm text-mute">Nenhum repositório corresponde aos filtros.</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {items.slice(0, visible).map((r) => (
            <li key={r.id} className="card flex min-w-0 flex-col p-4">
              <div className="flex items-start justify-between gap-2">
                <a href={r.html_url} target="_blank" rel="noreferrer" className="min-w-0 truncate font-semibold text-accent2 hover:underline">{r.name}</a>
                {r.archived && <span className="inline-flex shrink-0 items-center gap-1 rounded border border-line px-1.5 py-0.5 text-xs text-mute"><Archive className="h-3 w-3" aria-hidden />Arquivado</span>}
              </div>
              <p className="mt-1 line-clamp-2 flex-1 text-sm text-mute">{r.description ?? 'Sem descrição.'}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mute">
                <span>{r.language ?? NO_LANGUAGE}</span>
                <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" aria-hidden />{formatNumber(r.stargazers_count)}<span className="sr-only"> estrelas</span></span>
                <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" aria-hidden />{formatNumber(r.forks_count)}<span className="sr-only"> forks</span></span>
                <span>Atualizado em {formatDate(r.updated_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {items.length > visible && (
        <div className="mt-4 text-center"><button className="btn-ghost" onClick={() => setVisible((v) => v + PAGE)}>Carregar mais ({items.length - visible} restantes)</button></div>
      )}
    </section>
  )
}
