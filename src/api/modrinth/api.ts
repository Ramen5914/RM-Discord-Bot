import { GetProject, GetProjectT } from './validation.js';

const baseUrl = 'https://api.modrinth.com/v2';

const apiKey = process.env.MODRINTH_PAT;

export async function getProject(modId: string): Promise<GetProjectT> {
  if (!apiKey) {
    throw new Error('MODRINTH_PAT is not set in environment variables');
  }

  const response = await fetch(`${baseUrl}/project/${modId}`, {
    method: 'GET',
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch mod data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return GetProject.parse(data);
}
