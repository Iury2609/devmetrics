import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart3, Github, Home, Moon, Scale, Sun } from 'lucide-react'
import { SearchForm } from '../ui/SearchForm'

const NAV = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/comparar', label: 'Comparar', icon: Scale, end: false },
]

function useTheme() {
  const [light, setLight] = useState(() => {
    try { return localStorage.getItem('devmetrics-theme') === 'light' } catch { return false }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
    try { localStorage.setItem('devmetrics-theme', light ? 'light' : 'dark') } catch { /* armazenamento indisponível */ }
  }, [light])
  return [light, () => setLight((v) => !v)] as const
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-panel2 text-ink' : 'text-mute hover:text-ink'}`

export function Layout() {
  const navigate = useNavigate()
  const [light, toggle] = useTheme()

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-panel p-4 lg:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2 text-lg font-semibold"><BarChart3 className="h-6 w-6 text-accent" aria-hidden />DevMetrics</Link>
        <nav aria-label="Principal" className="space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={navClass}><Icon className="h-4 w-4" aria-hidden />{label}</NavLink>)}
        </nav>
        <p className="mt-auto px-2 text-xs text-mute">Versão 0.1.0</p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold lg:hidden"><BarChart3 className="h-5 w-5 text-accent" aria-hidden />DevMetrics</Link>
          <div className="order-last w-full sm:order-none sm:ml-auto sm:max-w-sm sm:flex-1"><SearchForm label="Buscar perfil" onSubmit={(u) => navigate(`/u/${u}`)} /></div>
          <nav aria-label="Principal (compacto)" className="ml-auto flex gap-1 sm:ml-0 lg:hidden">
            {NAV.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} aria-label={label} className={navClass}><Icon className="h-4 w-4" aria-hidden /></NavLink>)}
          </nav>
          <button className="btn-ghost px-3" onClick={toggle} aria-label={light ? 'Ativar tema escuro' : 'Ativar tema claro'}>{light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}</button>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6"><Outlet /></main>
        <footer className="border-t border-line px-6 py-4 text-xs text-mute">
          <span>DevMetrics · dados públicos da GitHub REST API · não medem a qualidade de quem desenvolve. </span>
          <a className="inline-flex items-center gap-1 hover:text-ink" href="https://github.com" target="_blank" rel="noreferrer"><Github className="h-3.5 w-3.5" aria-hidden />GitHub</a>
        </footer>
      </div>
    </div>
  )
}
