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

export async function getVersion(
  versionId: string,
): Promise<{ version_number: string; name: string; date_published: string }> {
  if (!apiKey) {
    throw new Error('MODRINTH_PAT is not set in environment variables');
  }

  const response = await fetch(`${baseUrl}/version/${versionId}`, {
    method: 'GET',
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch version data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    version_number: data.version_number,
    name: data.name,
    date_published: data.date_published,
  };
}
