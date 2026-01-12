import { Discord, Slash, SlashOption } from 'discordx';
import { autocompleteModNames, getGuildById, getModByGuildAndName } from '../utils/database.js';
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { getProject } from '../api/modrinth/api.js';
import { getMod } from '../api/curseforge/api.js';
import { listReleases } from '../api/github/api.js';
@Discord()
export class Slashes {
  @Slash({ description: 'Get total mod downloads' })
  async get_downloads(
    @SlashOption({
      autocomplete: autocompleteModNames,
      description: 'Mod to get downloads for',
      name: 'mod',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    mod: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const guild = await getGuildById(interaction.guild!.id);
    if (!guild) {
      interaction.reply('Guild not found in database. Please run the setup command first.');
      return;
    }

    const selectedMod = await getModByGuildAndName(guild, mod);

    if (!selectedMod) {
      interaction.reply('Mod not found in database.');
      return;
    }

    let totalDownloads: number = 0;
    let color: number = 0xffffff;

    let cfDownloads: string | number;
    if (!selectedMod.curseforgeId) {
      cfDownloads = 'N/A';
    } else {
      const res = await getMod(selectedMod.curseforgeId);
      cfDownloads = res.data.downloadCount;
      totalDownloads += cfDownloads;
    }

    let mDownloads: string | number;
    if (!selectedMod.modrinthId) {
      mDownloads = 'N/A';
    } else {
      const res = await getProject(selectedMod.modrinthId);
      if (res.color) {
        color = res.color;
      }
      mDownloads = res.downloads;
      totalDownloads += mDownloads;
    }

    let gDownloads: string | number;
    if (!selectedMod.gitHubOwner || !selectedMod.gitHubRepo) {
      gDownloads = 'N/A';
    } else {
      gDownloads = 0;

      const res = await listReleases(selectedMod.gitHubOwner, selectedMod.gitHubRepo);
      for (const releases of res) {
        for (const assets of releases.assets) {
          gDownloads += assets.download_count;
        }
      }
      totalDownloads += gDownloads;
    }

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Downloads')
          .setDescription('Downloads across platforms')
          .setColor(color)
          .addFields(
            { name: 'CurseForge', value: `${cfDownloads}`, inline: true },
            { name: 'Modrinth', value: `${mDownloads}`, inline: true },
            { name: 'GitHub', value: `${gDownloads}`, inline: true },
            {
              name: 'Total',
              value: `${totalDownloads}`,
              inline: true,
            },
          )
          .setTimestamp(),
      ],
    });
  }
}
