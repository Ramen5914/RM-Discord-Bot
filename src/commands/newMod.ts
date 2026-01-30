import { Discord, Guard, Slash, SlashOption } from 'discordx';
import { IsAdmin } from '../guards/admin.js';
import { ApplicationCommandOptionType, CommandInteraction, Guild, MessageFlags } from 'discord.js';
import { ModEntity } from '../entity/Mod.js';
import { AppDataSource } from '../main.js';
import { GuildEntity } from '../entity/Guild.js';
import { populateModLinks } from '../utils/linkBuilder.js';

@Discord()
export class NewMod {
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
    @SlashOption({
      description: 'Should the command make channels?',
      name: 'make_channels',
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    })
    shouldMakeChannels: boolean | undefined,
    @SlashOption({
      description: 'Should the command make roles?',
      name: 'make_roles',
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    })
    shouldMakeRoles: boolean | undefined,
    interaction: CommandInteraction,
  ): Promise<void> {
    const mod = new ModEntity();

    mod.name = name.trim();

    const modRepository = AppDataSource.manager.getRepository(ModEntity);
    const savedMod = await modRepository.save(mod);

    // Populate links from APIs
    await populateModLinks(savedMod);

    const guildRepository = AppDataSource.manager.getRepository(GuildEntity);
    guildRepository.findOneBy({ id: interaction.guild!.id }).then(async (guildEntity) => {
      if (guildEntity) {
        savedMod.guild = guildEntity;
        await modRepository.save(savedMod);
      }
    });

    const guild = interaction.guild!;
    if (shouldMakeChannels || shouldMakeChannels === undefined) {
      this.makeChannels(savedMod, guild);
    }

    if (shouldMakeRoles || shouldMakeRoles === undefined) {
      this.makeRoles(savedMod, guild);
    }

    await interaction.reply({
      content: `Added mod ${savedMod.name} with id:${savedMod.id} to the database.`,
      flags: MessageFlags.Ephemeral,
    });
  }

  public makeChannels(mod: ModEntity, guild: Guild): void {
    console.log(`Making channels in guild ${guild} for mod ${mod.name}`);
  }

  public makeRoles(mod: ModEntity, guild: Guild): void {
    console.log(`Making roles in guild ${guild} for mod ${mod.name}`);
  }
}
