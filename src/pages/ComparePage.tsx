import { useSearchParams } from 'react-router-dom'
import { useProfileData } from '../hooks/useProfileData'
import { SearchForm } from '../components/ui/SearchForm'
import { ErrorBox } from '../components/ui/StateViews'
import { compareProfiles, topByStars } from '../utils/analytics'
import { formatNumber } from '../utils/formatters'
import type { LoadState, ProfileData } from '../types/github'

function Side({ name, state }: { name: string | undefined; state: LoadState<ProfileData> }) {
  if (!name) return <p className="card p-4 text-sm text-mute">Informe o usuário.</p>
  if (state.status === 'loading' || state.status === 'idle') return <div className="skeleton h-24" aria-busy="true" />
  if (state.status === 'error') return <ErrorBox kind={state.kind} message={`${name}: ${state.message}`} />
  const { user, repos } = state.data
  return (
    <div className="card flex items-center gap-3 p-4">
      <img src={user.avatar_url} alt={`Avatar de ${user.login}`} width={56} height={56} className="h-14 w-14 rounded-xl" />
      <div className="min-w-0"><p className="truncate font-semibold">{user.name ?? user.login}</p><p className="text-sm text-mute">@{user.login} · {formatNumber(repos.length)} repositórios carregados</p></div>
    </div>
  )
}

export function ComparePage() {
  const [params, setParams] = useSearchParams()
  const a = params.get('a') ?? undefined
  const b = params.get('b') ?? undefined
  const sa = useProfileData(a)
  const sb = useProfileData(b)
  const set = (key: 'a' | 'b', v: string) => { const p = new URLSearchParams(params); p.set(key, v); setParams(p) }

  const ready = sa.status === 'success' && sb.status === 'success'
  const metrics = ready ? compareProfiles(sa.data, sb.data) : []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Comparar perfis</h1>
      <p className="text-sm text-mute">Um número maior não significa que uma pessoa desenvolve melhor que a outra. Compare apenas indicadores públicos.</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3"><SearchForm key={`a-${a}`} initial={a} label="Primeiro usuário" onSubmit={(v) => set('a', v)} /><Side name={a} state={sa} /></div>
        <div className="space-y-3"><SearchForm key={`b-${b}`} initial={b} label="Segundo usuário" onSubmit={(v) => set('b', v)} /><Side name={b} state={sb} /></div>
      </div>
      {ready && (
        <>
          <section aria-label="Métricas comparadas" className="space-y-3">
            {metrics.map((m) => {
              const max = Math.max(m.a, m.b, 1)
              return (
                <div key={m.key} className="card p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-medium">{m.label}</h2><span className="text-xs text-mute">{m.diff === 0 ? 'Valores iguais' : `Diferença: ${formatNumber(m.diff)}`}</span></div>
                  {([['a', sa.data.user.login, m.a], ['b', sb.data.user.login, m.b]] as const).map(([side, login, val]) => (
                    <div key={side} className="mt-2 flex items-center gap-3 text-sm">
                      <span className="w-28 shrink-0 truncate text-mute">{login}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded bg-panel2"><div className="h-full rounded" style={{ width: `${(val / max) * 100}%`, background: side === 'a' ? 'var(--accent)' : 'var(--accent2)' }} /></div>
                      <span className="w-20 text-right tabular-nums">{formatNumber(val)}{m.leader === side ? ' ▲' : ''}</span>
                    </div>
                  ))}
                  {m.limited && <p className="mt-2 text-xs text-mute">Limitado aos repositórios carregados (até 100 por perfil). ▲ indica o maior valor.</p>}
                </div>
              )
            })}
          </section>
          <section aria-label="Repositórios mais populares" className="grid gap-4 md:grid-cols-2">
            {[sa.data, sb.data].map((d) => (
              <div key={d.user.login} className="card p-4">
                <h2 className="mb-2 font-medium">Mais estrelas · @{d.user.login}</h2>
                <ul className="space-y-1 text-sm">{topByStars(d.repos).map((r) => <li key={r.id} className="flex justify-between gap-2"><a className="truncate text-accent2 hover:underline" href={r.html_url} target="_blank" rel="noreferrer">{r.name}</a><span className="tabular-nums text-mute">{formatNumber(r.stargazers_count)}</span></li>)}</ul>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  )
}
