import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { ErrorKind } from '../../types/github'

const TITLES: Record<ErrorKind, string> = {
  not_found: 'Usuário não encontrado',
  rate_limit: 'Limite de requisições atingido',
  network: 'Sem conexão com o GitHub',
  timeout: 'A consulta demorou demais',
  http: 'A API do GitHub retornou um erro',
  invalid: 'Resposta inesperada',
}

export function ErrorBox({ kind, message, action }: { kind: ErrorKind; message: string; action?: ReactNode }) {
  return (
    <div role="alert" className="card flex items-start gap-3 p-5">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
      <div className="min-w-0">
        <p className="font-semibold">{TITLES[kind]}</p>
        <p className="mt-1 text-sm text-mute">{message}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div aria-busy="true" aria-label="Carregando perfil" className="space-y-6">
      <div className="skeleton h-32" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton h-28" />)}</div>
      <div className="skeleton h-72" />
    </div>
  )
}
