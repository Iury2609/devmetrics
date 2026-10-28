const nf = new Intl.NumberFormat('pt-BR')
const df = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

export const formatNumber = (n: number): string => nf.format(n)
export const formatPercent = (n: number): string => `${n.toFixed(1).replace('.', ',')}%`

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : df.format(d)
}

export function formatAccountAge(iso: string, now: Date = new Date()): string {
  const start = new Date(iso)
  if (Number.isNaN(start.getTime())) return '—'
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  if (now.getDate() < start.getDate()) months -= 1
  months = Math.max(0, months)
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts = [y ? `${y} ${y === 1 ? 'ano' : 'anos'}` : '', m ? `${m} ${m === 1 ? 'mês' : 'meses'}` : ''].filter(Boolean)
  return parts.join(' e ') || 'menos de 1 mês'
}
