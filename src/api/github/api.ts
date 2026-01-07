import { ReleasesList, ReleasesListT } from './validation.js';

const baseUrl = 'https://api.github.com';

const apiKey = process.env.GITHUB_PAT;

export async function listReleases(owner: string, repo: string): Promise<ReleasesListT> {
  if (!apiKey) {
    throw new Error('GITHUB_PAT is not set in environment variables');
  }

  const response = await fetch(`${baseUrl}/repos/${owner}/${repo}/releases`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${apiKey}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub releases: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return ReleasesList.parse(data);
}
