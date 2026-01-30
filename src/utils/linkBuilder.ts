import { ModEntity } from '../entity/Mod.js';
import { getMod } from '../api/curseforge/api.js';
import { getProject } from '../api/modrinth/api.js';

export async function populateModLinks(mod: ModEntity): Promise<void> {
  try {
    // Fetch CurseForge data
    if (mod.curseforgeId) {
      const cfResponse = await getMod(mod.curseforgeId);
      if (cfResponse.data) {
        mod.homepageUrl = cfResponse.data.links.websiteUrl || null;
        mod.wikiUrl = cfResponse.data.links.wikiUrl || null;
        mod.issuesUrl = cfResponse.data.links.issuesUrl || null;
        mod.sourceUrl = cfResponse.data.links.sourceUrl || null;
        mod.curseforgeUrl = `https://www.curseforge.com/minecraft/mc-mods/${mod.curseforgeId}`;
      }
    }

    // Fetch Modrinth data
    if (mod.modrinthId) {
      const mrResponse = await getProject(mod.modrinthId);
      if (mrResponse) {
        mod.modrinthUrl = `https://modrinth.com/mod/${mod.modrinthId}`;
        // Use CurseForge values if available, otherwise use Modrinth values
        if (!mod.wikiUrl && mrResponse.wiki_url) {
          mod.wikiUrl = mrResponse.wiki_url;
        }
        if (!mod.issuesUrl && mrResponse.issues_url) {
          mod.issuesUrl = mrResponse.issues_url;
        }
        if (!mod.sourceUrl && mrResponse.source_url) {
          mod.sourceUrl = mrResponse.source_url;
        }
      }
    }

    // Build GitHub URLs
    if (mod.gitHubOwner && mod.gitHubRepo) {
      mod.githubRepoUrl = `https://github.com/${mod.gitHubOwner}/${mod.gitHubRepo}`;
      // Set derived GitHub URLs if not already set manually
      if (!mod.issuesUrl) {
        mod.issuesUrl = `${mod.githubRepoUrl}/issues`;
      }
    }

    // Save to database
    // The caller should handle the save operation
  } catch (error) {
    console.error(`Error populating links for mod ${mod.name}:`, error);
    // Continue without throwing - partial data is better than failure
  }
}
