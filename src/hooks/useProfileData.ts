import { useEffect, useState } from 'react'
import { fetchProfile, GitHubError } from '../services/githubApi'
import type { LoadState, ProfileData } from '../types/github'

/** Carrega um perfil, cancelando a requisição anterior quando o usuário muda ou o componente desmonta. */
export function useProfileData(username: string | undefined, reloadKey = 0): LoadState<ProfileData> {
  const [state, setState] = useState<LoadState<ProfileData>>({ status: 'idle' })

  useEffect(() => {
    if (!username) {
      setState({ status: 'idle' })
      return
    }
    const controller = new AbortController()
    setState({ status: 'loading' })
    fetchProfile(username, controller.signal)
      .then((data) => setState({ status: 'success', data }))
      .catch((e: unknown) => {
        if (controller.signal.aborted) return
        if (e instanceof GitHubError) setState({ status: 'error', kind: e.kind, message: e.message })
        else setState({ status: 'error', kind: 'network', message: 'Erro inesperado ao consultar o GitHub.' })
      })
    return () => controller.abort()
  }, [username, reloadKey])

  return state
}
