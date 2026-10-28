import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="mt-2 text-mute">O endereço não existe no DevMetrics.</p>
      <Link to="/" className="btn-primary mt-6">Voltar ao início</Link>
    </div>
  )
}
