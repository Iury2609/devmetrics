import type { GitHubRepo, GitHubUser, ProfileData } from '../types/github'

export const NOW = new Date('2026-10-26T12:00:00Z')

export function repo(over: Partial<GitHubRepo> & { id: number }): GitHubRepo {
  return {
    name: `repo-${over.id}`, html_url: `https://github.com/x/repo-${over.id}`, description: null, language: null,
    stargazers_count: 0, forks_count: 0, updated_at: '2026-10-20T00:00:00Z', created_at: '2024-01-01T00:00:00Z',
    archived: false, fork: false, ...over,
  }
}

export function user(over: Partial<GitHubUser> = {}): GitHubUser {
  return {
    login: 'alice', name: null, avatar_url: 'https://example.com/a.png', html_url: 'https://github.com/alice', bio: null,
    company: null, location: null, blog: null, public_repos: 3, followers: 10, following: 5, created_at: '2020-01-01T00:00:00Z', ...over,
  }
}

export function profile(u: Partial<GitHubUser>, repos: GitHubRepo[]): ProfileData {
  return { user: user(u), repos, truncated: false, fetchedAt: NOW.toISOString() }
}
