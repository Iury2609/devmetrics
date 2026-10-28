const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

export type UsernameCheck = { ok: true; value: string } | { ok: false; message: string }

export function validateUsername(input: string): UsernameCheck {
  const value = input.trim().replace(/^@/, '')
  if (!value) return { ok: false, message: 'Digite um nome de usuário do GitHub.' }
  if (!USERNAME_RE.test(value)) {
    return { ok: false, message: 'Use apenas letras, números e hífens (até 39 caracteres, sem hífen no início ou no fim).' }
  }
  return { ok: true, value }
}
