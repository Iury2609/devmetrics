import { useState, type FormEvent } from 'react'
import { Search, X } from 'lucide-react'
import { validateUsername } from '../../utils/validation'

interface Props { initial?: string; onSubmit: (username: string) => void; label?: string; large?: boolean }

export function SearchForm({ initial = '', onSubmit, label = 'Nome de usuário do GitHub', large = false }: Props) {
  const [value, setValue] = useState(initial)
  const [error, setError] = useState<string | null>(null)

  function handle(e: FormEvent) {
    e.preventDefault()
    const check = validateUsername(value)
    if (!check.ok) return setError(check.message)
    setError(null)
    onSubmit(check.value)
  }

  return (
    <form onSubmit={handle} noValidate className="w-full" role="search">
      <label htmlFor={`search-${label}`} className="sr-only">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" aria-hidden />
          <input
            id={`search-${label}`}
            className={`field pl-9 pr-9 ${large ? 'py-3 text-base' : ''}`}
            placeholder="ex.: torvalds"
            value={value}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `err-${label}` : undefined}
            onChange={(e) => { setValue(e.target.value); setError(null) }}
          />
          {value && (
            <button type="button" aria-label="Limpar busca" onClick={() => { setValue(''); setError(null) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-mute hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button type="submit" className={`btn-primary ${large ? 'px-6' : ''}`}>Analisar</button>
      </div>
      {error && <p id={`err-${label}`} role="alert" className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  )
}
