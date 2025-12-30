import { ApplicationCommandOptionType, CommandInteraction } from 'discord.js';
import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { db } from '../main.js';
import { IsAdmin } from '../guards/admin.js';

@Discord()
export class Setup {
  @Slash({ description: 'Setup categories, channels, and roles for a new mod' })
  @Guard(IsAdmin)
  async new_mod(
    @SlashOption({
      description: 'Mod name',
      name: 'name',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    name: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const mods: object[] = db.get('mods');

    mods.push({
      name: name,
    });

    interaction.reply('This command is not yet implemented.');
  }

  @Slash({ description: 'Check set-up mods' })
  @Guard(IsAdmin)
  async get_mods(interaction: CommandInteraction): Promise<void> {
    const mods: object[] = db.get('mods');

    for (const mod of mods) {
      console.log(mod);
    }

    interaction.reply('This command is not yet implemented.');
  }
}
