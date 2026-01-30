import { EmbedBuilder } from 'discord.js';
import { ModEntity } from '../entity/Mod.js';
import { getMod } from '../api/curseforge/api.js';
import { getProject, getVersion } from '../api/modrinth/api.js';
import { listReleases } from '../api/github/api.js';

export async function buildModInfoEmbed(mod: ModEntity): Promise<EmbedBuilder> {
  let color: number = 0xffffff;
  let description: string = '';

  // Fetch CurseForge data for description and downloads
  let cfDownloads: number | string = 'N/A';
  let cfLatestVersion: string | null = null;
  let cfLatestDate: string | null = null;

  if (mod.curseforgeId) {
    try {
      const cfResponse = await getMod(mod.curseforgeId);
      if (cfResponse.data) {
        description = cfResponse.data.summary || '';
        cfDownloads = cfResponse.data.downloadCount;
        if (cfResponse.data.latestFiles && cfResponse.data.latestFiles.length > 0) {
          // Find the latest file by sorting by file date
          const latestFile = cfResponse.data.latestFiles.reduce((latest, current) => {
            return new Date(current.fileDate) > new Date(latest.fileDate) ? current : latest;
          });
          cfLatestVersion = latestFile.displayName;
          cfLatestDate = new Date(latestFile.fileDate).toLocaleDateString();
        }
      }
    } catch (error) {
      console.error(`Error fetching CurseForge data for mod ${mod.name}:`, error);
    }
  }

  // Fetch Modrinth data
  let mrDownloads: number | string = 'N/A';
  let mrLatestVersion: string | null = null;
  let mrLatestDate: string | null = null;

  if (mod.modrinthId) {
    try {
      const mrResponse = await getProject(mod.modrinthId);
      if (mrResponse) {
        if (mrResponse.color) {
          color = mrResponse.color;
        }
        mrDownloads = mrResponse.downloads;
        // Get latest version details from the versions array
        if (mrResponse.versions && mrResponse.versions.length > 0) {
          try {
            const versionDetails = await getVersion(mrResponse.versions[0]);
            mrLatestVersion = versionDetails.version_number;
            mrLatestDate = new Date(versionDetails.date_published).toLocaleDateString();
          } catch (versionError) {
            console.error(
              `Error fetching Modrinth version details for mod ${mod.name}:`,
              versionError,
            );
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching Modrinth data for mod ${mod.name}:`, error);
    }
  }

  // Fetch GitHub data
  let ghDownloads: number | string = 'N/A';
  let ghLatestVersion: string | null = null;
  let ghLatestDate: string | null = null;

  if (mod.gitHubOwner && mod.gitHubRepo) {
    try {
      const releases = await listReleases(mod.gitHubOwner, mod.gitHubRepo);
      let totalDownloads = 0;
      if (releases.length > 0) {
        ghLatestVersion = releases[0].name || releases[0].tag_name;
        ghLatestDate = new Date(releases[0].published_at).toLocaleDateString();
      }
      for (const release of releases) {
        for (const asset of release.assets) {
          totalDownloads += asset.download_count;
        }
      }
      ghDownloads = totalDownloads;
    } catch (error) {
      console.error(`Error fetching GitHub data for mod ${mod.name}:`, error);
    }
  }

  // Build the embed
  const embed = new EmbedBuilder()
    .setTitle(mod.name)
    .setURL(mod.homepageUrl || null)
    .setDescription(description || 'No description available')
    .setColor(color);

  // Add download fields - field names are plain text, links go in values
  const cfValue = mod.curseforgeUrl
    ? `[${cfDownloads} Downloads](${mod.curseforgeUrl})`
    : cfDownloads.toString();
  const mrValue = mod.modrinthUrl
    ? `[${mrDownloads} Downloads](${mod.modrinthUrl})`
    : mrDownloads.toString();
  const ghValue = mod.githubRepoUrl
    ? `[${ghDownloads} Downloads](${mod.githubRepoUrl}/releases)`
    : ghDownloads.toString();

  embed.addFields(
    { name: 'Downloads', value: '\u200b', inline: false },
    { name: 'CurseForge', value: cfValue, inline: true },
    { name: 'Modrinth', value: mrValue, inline: true },
    { name: 'GitHub', value: ghValue, inline: true },
  );

  // Add version info if available
  if (cfLatestVersion || mrLatestVersion || ghLatestVersion) {
    const versions: string[] = [];
    if (cfLatestVersion) {
      versions.push(
        `**CurseForge:** ${cfLatestVersion}${cfLatestDate ? ` (${cfLatestDate})` : ''}`,
      );
    }
    if (mrLatestVersion) {
      versions.push(`**Modrinth:** ${mrLatestVersion}${mrLatestDate ? ` (${mrLatestDate})` : ''}`);
    }
    if (ghLatestVersion) {
      versions.push(`**GitHub:** ${ghLatestVersion}${ghLatestDate ? ` (${ghLatestDate})` : ''}`);
    }

    if (versions.length > 0) {
      embed.addFields({
        name: 'Latest Versions',
        value: versions.join('\n'),
        inline: false,
      });
    }
  }

  // Add links field
  const links: string[] = [];
  if (mod.wikiUrl) links.push(`[Wiki](${mod.wikiUrl})`);
  if (mod.issuesUrl) links.push(`[Issues](${mod.issuesUrl})`);
  if (mod.githubProjectBoardUrl) links.push(`[Project Board](${mod.githubProjectBoardUrl})`);
  if (mod.sourceUrl) links.push(`[Source](${mod.sourceUrl})`);

  if (links.length > 0) {
    embed.addFields({
      name: 'Links',
      value: links.join(' • '),
      inline: false,
    });
  } else {
    embed.addFields({
      name: 'Links',
      value: 'N/A',
      inline: false,
    });
  }

  embed.setTimestamp();

  return embed;
}
