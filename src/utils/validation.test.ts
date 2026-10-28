import { describe, expect, it } from 'vitest'
import { validateUsername } from './validation'

describe('validateUsername', () => {
  it('rejeita entrada vazia', () => expect(validateUsername('   ').ok).toBe(false))
  it('aceita nomes válidos e remove @ e espaços', () => {
    expect(validateUsername(' @torvalds ')).toEqual({ ok: true, value: 'torvalds' })
    expect(validateUsername('a-b-1').ok).toBe(true)
  })
  it('rejeita hífen no início/fim, hífens duplos, símbolos e nomes longos', () => {
    for (const bad of ['-abc', 'abc-', 'a--b', 'a b', 'a/b', 'a'.repeat(40)]) expect(validateUsername(bad).ok).toBe(false)
  })
})
