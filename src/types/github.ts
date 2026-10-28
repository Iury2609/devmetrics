export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  company: string | null
  location: string | null
  blog: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export interface GitHubRepo {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  created_at: string
  archived: boolean
  fork: boolean
}

export interface ProfileData {
  user: GitHubUser
  repos: GitHubRepo[]
  /** true quando o usuário tem mais repositórios públicos do que os carregados (limite de 100 por página). */
  truncated: boolean
  fetchedAt: string
}

export type ErrorKind = 'not_found' | 'rate_limit' | 'network' | 'timeout' | 'http' | 'invalid'

export type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; kind: ErrorKind; message: string }
