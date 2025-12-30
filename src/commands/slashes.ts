import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { cModId, mModId } from '../constants.js';
import { getProject } from '../api/modrinth/api.js';
import { getMod } from '../api/curseforge/api.js';
@Discord()
export class Slashes {
  @Slash({ description: 'Get total mod downloads' })
  async get_downloads(interaction: CommandInteraction): Promise<void> {
    const res = await getMod(cModId);
    const res2 = await getProject(mModId);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Downloads')
          .setDescription('Downloads across platforms')
          .setColor(res2.color ?? 0xffffff)
          .addFields(
            { name: 'CurseForge', value: `${res.data.downloadCount}`, inline: true },
            { name: 'Modrinth', value: `${res2.downloads}`, inline: true },
          )
          .setTimestamp(),
      ],
    });
  }
}
