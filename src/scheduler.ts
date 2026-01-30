import { Client } from 'discord.js';
import { DataSource } from 'typeorm';
import { CronJob } from 'cron';
import { ManagedMessageEntity } from './entity/ManagedMessage.js';
import { buildModInfoEmbed } from './utils/embedBuilder.js';

export function initializeScheduler(client: Client, dataSource: DataSource): void {
  new CronJob('*/10 * * * *', async () => {
    try {
      const managedMessageRepository = dataSource.getRepository(ManagedMessageEntity);
      const managedMessages = await managedMessageRepository.find({
        relations: ['mod'],
      });

      for (const managedMessage of managedMessages) {
        try {
          // Fetch the channel - extract channel ID from message ID (channelId is stored as context)
          // We need to find the channel by looking up the message
          let found = false;

          // Try to find the message across all cached channels
          for (const guild of client.guilds.cache.values()) {
            for (const channel of guild.channels.cache.values()) {
              if (channel.isTextBased()) {
                try {
                  const message = await channel.messages.fetch(managedMessage.id);
                  if (message) {
                    // Update the message with fresh embed
                    const embed = await buildModInfoEmbed(managedMessage.mod);
                    await message.edit({ embeds: [embed] });
                    found = true;
                    break;
                  }
                } catch {
                  // Message not found in this channel, continue
                }
              }
            }
            if (found) break;
          }

          if (!found) {
            // Message was deleted, remove from database
            await managedMessageRepository.remove(managedMessage);
            console.log(
              `Removed managed message ${managedMessage.id} for mod ${managedMessage.mod.name} (message not found)`,
            );
          }
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.includes('404') || error.message.includes('Unknown Message')) {
              // Message was deleted
              try {
                await managedMessageRepository.remove(managedMessage);
              } catch {
                // Already deleted
              }
            } else {
              console.error(
                `Error updating managed message ${managedMessage.id} for mod ${managedMessage.mod.name}:`,
                error.message,
              );
            }
          }
        }

        // Rate limiting
        await new Promise((resolve) => setTimeout(resolve, 75));
      }
    } catch (error) {
      console.error('Error in scheduler task:', error);
    }
  }).start();

  console.log('Scheduler initialized - will update managed messages every 10 minutes');
}
