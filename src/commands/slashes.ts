import { Discord, Slash, SlashOption } from 'discordx';
import { autocompleteModNames, getModFromDatabase } from '../utils/database.js';
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder } from 'discord.js';
import { getProject } from '../api/modrinth/api.js';
import { getMod } from '../api/curseforge/api.js';
import { listReleases } from '../api/github/api.js';
import { buildModInfoEmbed } from '../utils/embedBuilder.js';
import { AppDataSource } from '../main.js';
import { ManagedMessageEntity, MessageType } from '../entity/ManagedMessage.js';

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
    const selectedMod = await getModFromDatabase(interaction, mod);

    if (!selectedMod) {
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

  @Slash({ description: 'Sends a message with mod information that updates every 10 minutes' })
  async send_mod_info(
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
    const modEntity = await getModFromDatabase(interaction, mod);

    if (!modEntity) {
      return;
    }

    // Check if info channel is configured
    if (!modEntity.infoChannelId) {
      await interaction.reply('This mod does not have an info channel configured.');
      return;
    }

    try {
      // Fetch the channel
      const channel = await interaction.client.channels.fetch(modEntity.infoChannelId);

      if (!channel || !channel.isTextBased() || !('send' in channel)) {
        await interaction.reply('Info channel is not a text channel or could not be found.');
        return;
      }

      // Build and send the embed
      const embed = await buildModInfoEmbed(modEntity);
      const sentMessage = await channel.send({ embeds: [embed] });

      // Create and save managed message entity
      const managedMessageRepository = AppDataSource.manager.getRepository(ManagedMessageEntity);
      const managedMessage = new ManagedMessageEntity();
      managedMessage.id = sentMessage.id;
      managedMessage.type = MessageType.MOD_INFO;
      managedMessage.mod = modEntity;

      await managedMessageRepository.save(managedMessage);

      await interaction.reply({
        content: `Successfully sent mod info to ${channel}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error sending mod info for ${modEntity.name}:`, error);
      await interaction.reply({
        content:
          'Failed to send mod info. Check that the info channel exists and the bot has permissions to post there.',
        ephemeral: true,
      });
    }
  }

  @Slash({ description: 'Manually refresh mod info embeds' })
  async refresh_mod_info(
    @SlashOption({
      autocomplete: autocompleteModNames,
      description: 'Mod to refresh',
      name: 'mod',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    mod: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const modEntity = await getModFromDatabase(interaction, mod);

    if (!modEntity) {
      return;
    }

    try {
      // Defer the reply immediately since this command will take time
      await interaction.deferReply({ ephemeral: true });

      const managedMessageRepository = AppDataSource.manager.getRepository(ManagedMessageEntity);
      const managedMessages = await managedMessageRepository.find({
        where: { mod: { id: modEntity.id } },
        relations: ['mod'],
      });

      if (managedMessages.length === 0) {
        await interaction.editReply({
          content: 'No managed messages found for this mod.',
        });
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      const embed = await buildModInfoEmbed(modEntity);

      for (const managedMsg of managedMessages) {
        try {
          let found = false;

          // Search through all guilds and channels to find the message
          for (const guild of interaction.client.guilds.cache.values()) {
            for (const channel of guild.channels.cache.values()) {
              if (channel.isTextBased() && 'messages' in channel) {
                try {
                  const message = await channel.messages.fetch(managedMsg.id);
                  if (message && 'edit' in message) {
                    await message.edit({ embeds: [embed] });
                    successCount++;
                    found = true;
                    break;
                  }
                } catch {
                  // Message not in this channel, continue
                }
              }
            }
            if (found) break;
          }

          if (!found) {
            // Message was deleted, remove from database
            await managedMessageRepository.remove(managedMsg);
            failureCount++;
          }
        } catch (error) {
          console.error(`Error refreshing message ${managedMsg.id}:`, error);
          failureCount++;
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 75));
      }

      await interaction.editReply({
        content: `Refreshed ${successCount} messages successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}`,
      });
    } catch (error) {
      console.error(`Error refreshing mod info for ${modEntity.name}:`, error);
      try {
        await interaction.editReply({
          content: 'Failed to refresh mod info.',
        });
      } catch {
        // Interaction may have already been replied to
      }
    }
  }
}
