import { useState } from 'react'
import { Building2, CalendarDays, Check, ExternalLink, Link2, MapPin, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { GitHubUser } from '../../types/github'
import { formatAccountAge, formatDate } from '../../utils/formatters'

export function ProfileHeader({ user }: { user: GitHubUser }) {
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null)

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    setTimeout(() => setCopied(null), 2500)
  }

  const blog = user.blog?.trim()
  const blogUrl = blog ? (/^https?:\/\//i.test(blog) ? blog : `https://${blog}`) : null

  return (
    <header className="card flex flex-col gap-5 p-5 sm:flex-row">
      <img src={user.avatar_url} alt={`Avatar de ${user.login}`} width={96} height={96} className="h-24 w-24 shrink-0 rounded-2xl border border-line" />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-semibold">{user.name ?? user.login}</h1>
        <p className="text-sm text-mute">@{user.login}</p>
        {user.bio && <p className="mt-2 max-w-prose text-sm">{user.bio}</p>}
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute">
          {user.location && <li className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" aria-hidden />{user.location}</li>}
          {user.company && <li className="inline-flex items-center gap-1.5"><Building2 className="h-4 w-4" aria-hidden />{user.company}</li>}
          {blogUrl && <li className="inline-flex min-w-0 items-center gap-1.5"><Link2 className="h-4 w-4 shrink-0" aria-hidden /><a href={blogUrl} target="_blank" rel="noreferrer" className="truncate hover:text-ink hover:underline">{blog}</a></li>}
          <li className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" aria-hidden />Conta criada em {formatDate(user.created_at)} ({formatAccountAge(user.created_at)})</li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <a className="btn-primary" href={user.html_url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" aria-hidden />Abrir no GitHub</a>
          <button className="btn-ghost" onClick={copy}>{copied === 'ok' ? <Check className="h-4 w-4 text-ok" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}Copiar link da análise</button>
          <Link className="btn-ghost" to={`/comparar?a=${encodeURIComponent(user.login)}`}><Scale className="h-4 w-4" aria-hidden />Comparar com outro usuário</Link>
        </div>
        <p role="status" className="mt-2 h-4 text-xs text-mute">{copied === 'ok' ? 'Link copiado.' : copied === 'fail' ? 'Não foi possível copiar. Copie o endereço pela barra do navegador.' : ''}</p>
      </div>
    </header>
  )
}
