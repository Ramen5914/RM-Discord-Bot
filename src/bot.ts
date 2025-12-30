import { IntentsBitField, Interaction, Message } from 'discord.js';
import { Client } from 'discordx';

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],
  silent: false,

  simpleCommand: {
    prefix: '!',
  },
});

bot.once('clientReady', async () => {
  void bot.initApplicationCommands();
});

bot.on('interactionCreate', async (interaction: Interaction) => {
  await bot.executeInteraction(interaction);
});

bot.on('messageCreate', (message: Message) => {
  void bot.executeCommand(message);
});
