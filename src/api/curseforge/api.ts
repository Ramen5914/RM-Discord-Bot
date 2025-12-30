import { GetMod, GetModT } from './validation.js';

const baseUrl = 'https://api.curseforge.com';

const apiKey = process.env.CURSEFORGE_API_KEY;

export async function getMod(modId: string): Promise<GetModT> {
  if (!apiKey) {
    throw new Error('CURSEFORGE_API_KEY is not set in environment variables');
  }

  const response = await fetch(`${baseUrl}/v1/mods/${modId}`, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch mod data: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return GetMod.parse(data);
}
