import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { LanguageSlice } from '../../utils/analytics'
import { formatNumber, formatPercent } from '../../utils/formatters'

export const PALETTE = ['#8b6bff', '#4c8dff', '#22c1c3', '#f5a524', '#ec4899', '#34d399', '#a3a3b8', '#f97316']

export function LanguageChart({ data }: { data: LanguageSlice[] }) {
  if (data.length === 0) return <p className="py-10 text-center text-sm text-mute">Não há repositórios suficientes para calcular a distribuição.</p>
  const shown = data.slice(0, 8)
  return (
    <div className="grid items-center gap-4 sm:grid-cols-2">
      <div className="h-56" role="img" aria-label={`Gráfico de rosca: ${shown.map((s) => `${s.name} ${formatPercent(s.percent)}`).join(', ')}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={shown} dataKey="count" nameKey="name" innerRadius="60%" outerRadius="90%" paddingAngle={2} stroke="none">
              {shown.map((s, i) => <Cell key={s.name} fill={PALETTE[i % PALETTE.length]} />)}
            </Pie>
            <Tooltip formatter={(v: number, n: string) => [`${formatNumber(v)} repositório(s)`, n]}
              contentStyle={{ background: 'var(--panel2)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink)' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-2 text-sm">
        {shown.map((s, i) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} aria-hidden />
            <span className="min-w-0 flex-1 truncate">{s.name}</span>
            <span className="tabular-nums text-mute">{s.count} · {formatPercent(s.percent)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
