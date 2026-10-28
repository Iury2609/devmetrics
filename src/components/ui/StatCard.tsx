import type { LucideIcon } from 'lucide-react'
import { formatNumber } from '../../utils/formatters'

interface Props { icon: LucideIcon; label: string; value: number; hint: string }

export function StatCard({ icon: Icon, label, value, hint }: Props) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-sm text-mute"><Icon className="h-4 w-4 text-accent" aria-hidden />{label}</div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{formatNumber(value)}</p>
      <p className="mt-1 text-xs text-mute">{hint}</p>
    </div>
  )
}
