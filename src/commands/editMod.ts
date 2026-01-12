import { Discord, Guard, ModalComponent, Slash, SlashOption } from 'discordx';
import { IsAdmin } from '../guards/admin.js';
import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  CategoryChannel,
  CommandInteraction,
  ForumChannel,
  GuildChannel,
  LabelBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  NewsChannel,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { AppDataSource } from '../main.js';
import { ModEntity } from '../entity/Mod.js';
import { GuildEntity } from '../entity/Guild.js';

@Discord()
export class EditMod {
  @Slash({ description: 'Edit mod data' })
  @Guard(IsAdmin)
  async edit_mod_data(
    @SlashOption({
      autocomplete: async (interaction: AutocompleteInteraction) => {
        const guildId = interaction.guild!.id;

        const guildRepository = AppDataSource.manager.getRepository(GuildEntity);
        const guild = await guildRepository.findOneBy({ id: guildId });

        if (!guild) {
          interaction.respond([]);
          return;
        }

        const modRepository = AppDataSource.manager.getRepository(ModEntity);
        const mods = await modRepository.findBy({ guild: guild });

        const focused = interaction.options.getFocused();
        const filtered = mods
          .filter((mod) => mod.name.toLowerCase().includes(focused.toLowerCase()))
          .slice(0, 25)
          .map((mod) => ({ name: mod.name, value: mod.name }));
        interaction.respond(filtered);
      },
      description: 'Mod to get downloads for',
      name: 'mod',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    mod: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const guildRepository = AppDataSource.manager.getRepository(GuildEntity);
    const guild = await guildRepository.findOneBy({ id: interaction.guild!.id });

    if (!guild) {
      interaction.reply('Guild not found in database. Please run the setup command first.');
      return;
    }

    const modRepository = AppDataSource.manager.getRepository(ModEntity);

    const selectedMod = await modRepository.findOneBy({ name: mod });

    if (!selectedMod) {
      interaction.reply('Mod not found in database.');
      return;
    }

    const modal = new ModalBuilder()
      .setTitle(`Edit *${selectedMod.name}* Details`)
      .setCustomId(`edit_mod_data_modal-${selectedMod.id}`);

    const nameLabelComponent = new LabelBuilder()
      .setLabel('Mod Name')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('nameField')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder(selectedMod.name)
          .setRequired(false),
      );

    const githubLabelComponent = new LabelBuilder()
      .setLabel('GitHub Repo')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('githubField')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder(`${selectedMod.gitHubOwner}/${selectedMod.gitHubRepo}`)
          .setRequired(false),
      );

    const modrinthLabelComponent = new LabelBuilder().setLabel('Modrinth ID').setTextInputComponent(
      new TextInputBuilder()
        .setCustomId('modrinthField')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder(selectedMod.modrinthId || 'Enter Modrinth ID')
        .setRequired(false),
    );

    const curseforgeLabelComponent = new LabelBuilder()
      .setLabel('CurseForge ID')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('curseforgeField')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder(selectedMod.curseforgeId || 'Enter CurseForge ID')
          .setRequired(false),
      );

    modal.addLabelComponents(
      nameLabelComponent,
      githubLabelComponent,
      modrinthLabelComponent,
      curseforgeLabelComponent,
    );

    interaction.showModal(modal);
  }

  @Slash({ description: 'Edit mod channels' })
  @Guard(IsAdmin)
  async edit_mod_channels(
    @SlashOption({
      autocomplete: async (interaction: AutocompleteInteraction) => {
        const guildId = interaction.guild!.id;

        const guildRepository = AppDataSource.manager.getRepository(GuildEntity);
        const guild = await guildRepository.findOneBy({ id: guildId });

        if (!guild) {
          interaction.respond([]);
          return;
        }

        const modRepository = AppDataSource.manager.getRepository(ModEntity);
        const mods = await modRepository.findBy({ guild: guild });

        const focused = interaction.options.getFocused();
        const filtered = mods
          .filter((mod) => mod.name.toLowerCase().includes(focused.toLowerCase()))
          .slice(0, 25)
          .map((mod) => ({ name: mod.name, value: mod.name }));
        interaction.respond(filtered);
      },
      description: 'Mod to get downloads for',
      name: 'mod',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    mod: string,
    @SlashOption({
      description: 'New Category',
      name: 'category',
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    category: CategoryChannel | undefined,
    @SlashOption({
      description: 'New Announcement Channel (ID)',
      name: 'announcement_channel',
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    announcementChannel: NewsChannel | undefined,
    @SlashOption({
      description: 'New Info Channel',
      name: 'info_channel',
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    infoChannel: GuildChannel | undefined,
    @SlashOption({
      description: 'New GitHub Channel',
      name: 'github_channel',
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    githubChannel: GuildChannel | undefined,
    @SlashOption({
      description: 'New Collaborator Channel',
      name: 'collaborator_channel',
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    collaboratorChannel: GuildChannel | undefined,
    @SlashOption({
      description: 'New Chat Channel',
      name: 'chat_channel',
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    chatChannel: GuildChannel | undefined,
    @SlashOption({
      description: 'New Suggestions Channel',
      name: 'suggestions_channel',
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    suggestionsChannel: ForumChannel | undefined,
    @SlashOption({
      description: 'New Support Channel',
      name: 'support_channel',
      required: false,
      type: ApplicationCommandOptionType.Channel,
    })
    supportChannel: ForumChannel | undefined,
    interaction: CommandInteraction,
  ): Promise<void> {
    const guildRepository = AppDataSource.manager.getRepository(GuildEntity);
    const guild = await guildRepository.findOneBy({ id: interaction.guild!.id });

    if (!guild) {
      interaction.reply('Guild not found in database. Please run the setup command first.');
      return;
    }

    const modRepository = AppDataSource.manager.getRepository(ModEntity);

    const selectedMod = await modRepository.findOneBy({ name: mod });

    if (!selectedMod) {
      interaction.reply('Mod not found in database.');
      return;
    }

    selectedMod.announcementChannelId =
      announcementChannel?.id ?? selectedMod.announcementChannelId;
    selectedMod.infoChannelId = infoChannel?.id ?? selectedMod.infoChannelId;
    selectedMod.githubChannelId = githubChannel?.id ?? selectedMod.githubChannelId;
    selectedMod.collaboratorChannelId =
      collaboratorChannel?.id ?? selectedMod.collaboratorChannelId;
    selectedMod.chatChannelId = chatChannel?.id ?? selectedMod.chatChannelId;
    selectedMod.suggestionsChannelId = suggestionsChannel?.id ?? selectedMod.suggestionsChannelId;
    selectedMod.supportChannelId = supportChannel?.id ?? selectedMod.supportChannelId;

    await modRepository.save(selectedMod);

    interaction.reply(
      `${announcementChannel}${infoChannel}${githubChannel}${collaboratorChannel}${chatChannel}${suggestionsChannel}${supportChannel}`,
    ); // Placeholder reply
  }

  @ModalComponent({ id: /^edit_mod_data_modal-.*/ })
  async EditModDataForm(interaction: ModalSubmitInteraction): Promise<void> {
    const modId = interaction.customId.replace('edit_mod_data_modal-', '');

    const [name, github, modrinth, curseforge] = [
      'nameField',
      'githubField',
      'modrinthField',
      'curseforgeField',
    ].map((id) => interaction.fields.getTextInputValue(id));

    const modRepository = AppDataSource.manager.getRepository(ModEntity);

    const mod = await modRepository.findOneBy({ id: modId });

    if (!mod) {
      interaction.reply('Mod not found in database.');
      return;
    }

    // Update the mod in the array
    mod.name = name || mod.name;
    mod.gitHubOwner = github.split('/')[0] || mod.gitHubOwner;
    mod.gitHubRepo = github.split('/')[1] || mod.gitHubRepo;
    mod.modrinthId = modrinth || mod.modrinthId;
    mod.curseforgeId = curseforge || mod.curseforgeId;

    // Save the updated mods array back to the database
    const savedMod = await modRepository.save(mod);

    interaction.reply(`Successfully updated mod: ${savedMod.name}`);
  }
}
