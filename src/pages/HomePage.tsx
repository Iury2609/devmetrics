import { useNavigate } from 'react-router-dom'
import { SearchForm } from '../components/ui/SearchForm'

const EXAMPLES = ['torvalds', 'gaearon', 'sindresorhus']

export function HomePage() {
  const navigate = useNavigate()
  return (
    <section className="mx-auto max-w-2xl py-12 text-center">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Entenda o código por trás de cada perfil.</h1>
      <p className="mt-3 text-mute">Explore repositórios, linguagens e atividade pública de desenvolvedores no GitHub.</p>
      <div className="mt-8 text-left"><SearchForm large label="Buscar usuário" onSubmit={(u) => navigate(`/u/${u}`)} /></div>
      <p className="mt-6 text-sm text-mute">Exemplos de perfis públicos reais para experimentar:</p>
      <ul className="mt-2 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((u) => <li key={u}><button className="btn-ghost px-3 py-1" onClick={() => navigate(`/u/${u}`)}>{u}</button></li>)}
      </ul>
    </section>
  )
}
