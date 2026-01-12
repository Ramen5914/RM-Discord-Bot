import { ApplicationCommandOptionType, CommandInteraction, Role } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { AppDataSource } from '../main.js';
import { GuildEntity } from '../entity/Guild.js';

@Discord()
export class Setup {
  @Slash({ description: 'Setup the bot in this server' })
  async setup(
    @SlashOption({
      description: 'Moderator Role',
      name: 'moderator_role',
      required: true,
      type: ApplicationCommandOptionType.Role, // Role type
    })
    moderatorRole: Role,
    interaction: CommandInteraction,
  ): Promise<void> {
    const guildRepository = AppDataSource.manager.getRepository(GuildEntity);

    const guild = new GuildEntity();
    guild.id = interaction.guild!.id;
    guild.moderatorRoleId = moderatorRole.id;
    const savedGuild = await guildRepository.save(guild);

    await interaction.reply(`Setup complete for guild with id: ${savedGuild.id}`);
  }

  // @Slash({ description: 'Check set-up mods' })
  // @Guard(IsAdmin)
  // async get_mods(interaction: CommandInteraction): Promise<void> {
  //   const mods: Mod[] = db.get('mods');

  //   for (const mod of mods) {
  //     console.log(mod);
  //   }

  //   interaction.reply('This command is not yet implemented.');
  // }
}
