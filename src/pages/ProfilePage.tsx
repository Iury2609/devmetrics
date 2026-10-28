import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Activity, GitFork, Star, UserPlus, Users, FolderGit2 } from 'lucide-react'
import { useProfileData } from '../hooks/useProfileData'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { StatCard } from '../components/ui/StatCard'
import { ErrorBox, ProfileSkeleton } from '../components/ui/StateViews'
import { LanguageChart } from '../components/charts/LanguageChart'
import { RepoList } from '../components/repositories/RepoList'
import { countRecent, languageDistribution, RECENT_DAYS, sumForks, sumStars, topByStars } from '../utils/analytics'
import { formatAccountAge, formatDate, formatNumber } from '../utils/formatters'
import { validateUsername } from '../utils/validation'

export function ProfilePage() {
  const { username = '' } = useParams()
  const [reload, setReload] = useState(0)
  const check = validateUsername(username)
  const state = useProfileData(check.ok ? check.value : undefined, reload)

  if (!check.ok) return <ErrorBox kind="not_found" message={check.message} />
  if (state.status === 'idle' || state.status === 'loading') return <ProfileSkeleton />
  if (state.status === 'error') {
    const retry = state.kind !== 'not_found' ? <button className="btn-ghost" onClick={() => setReload((n) => n + 1)}>Tentar novamente</button> : undefined
    return <ErrorBox kind={state.kind} message={state.message} action={retry} />
  }

  const { user, repos, truncated, fetchedAt } = state.data
  const scope = `Calculado sobre ${formatNumber(repos.length)} repositório(s) carregado(s).`
  const top = topByStars(repos, 1)[0]
  const langs = languageDistribution(repos)

  return (
    <div className="space-y-8">
      <ProfileHeader user={user} />
      {truncated && (
        <p role="status" className="card p-3 text-sm text-mute">
          A análise usa os {formatNumber(repos.length)} repositórios retornados pela API (limite de 100 por consulta); o perfil tem {formatNumber(user.public_repos)} repositórios públicos.
        </p>
      )}
      <section aria-label="Estatísticas" className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={FolderGit2} label="Repositórios públicos" value={user.public_repos} hint="Total informado pelo perfil." />
        <StatCard icon={Users} label="Seguidores" value={user.followers} hint="Contas que seguem este perfil." />
        <StatCard icon={UserPlus} label="Seguindo" value={user.following} hint="Contas seguidas por este perfil." />
        <StatCard icon={Star} label="Estrelas acumuladas" value={sumStars(repos)} hint={scope} />
        <StatCard icon={GitFork} label="Forks acumulados" value={sumForks(repos)} hint={scope} />
        <StatCard icon={Activity} label={`Atividade em ${RECENT_DAYS} dias`} value={countRecent(repos)} hint={`Repositórios atualizados nos últimos ${RECENT_DAYS} dias. ${scope}`} />
      </section>
      <section aria-labelledby="analysis-title" className="grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <h2 id="analysis-title" className="text-lg font-semibold">Análise de desenvolvimento</h2>
          <p className="mb-4 text-xs text-mute">Linguagem principal por repositório. Não representa linhas de código nem experiência real.</p>
          <LanguageChart data={langs} />
        </div>
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-semibold">Resumo analítico</h3>
          <dl className="mt-3 space-y-3 text-sm">
            <div><dt className="text-mute">Linguagem mais frequente</dt><dd>{langs[0] ? `${langs[0].name} (${langs[0].count} repositórios)` : 'Sem dados'}</dd></div>
            <div><dt className="text-mute">Repositório com mais estrelas</dt><dd>{top && top.stargazers_count > 0 ? `${top.name} (${formatNumber(top.stargazers_count)} estrelas)` : 'Nenhum com estrelas'}</dd></div>
            <div><dt className="text-mute">Idade da conta</dt><dd>{formatAccountAge(user.created_at)}</dd></div>
          </dl>
          <p className="mt-4 text-xs text-mute">Consulta feita em {formatDate(fetchedAt)}. Estatísticas públicas não avaliam a capacidade profissional de ninguém.</p>
        </div>
      </section>
      <RepoList repos={repos} />
    </div>
  )
}
