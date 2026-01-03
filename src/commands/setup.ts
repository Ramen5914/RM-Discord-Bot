import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  CommandInteraction,
  LabelBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { Discord, Guard, ModalComponent, Slash, SlashOption } from 'discordx';
import { db } from '../main.js';
import { IsAdmin } from '../guards/admin.js';
import { Mod } from '../constants.js';

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
    @SlashOption({
      description: 'GitHub (owner/repo)',
      name: 'github',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    github: string,
    interaction: CommandInteraction,
  ): Promise<void> {
    const mods: Mod[] = db.get('mods') || [];

    const [owner, repo] = github.split('/');

    mods.push({
      name: name,
      gitHubOwner: owner,
      gitHubRepo: repo,
    });

    db.set('mods', mods);

    interaction.reply('This command is not yet implemented.');
  }

  @Slash({ description: 'Edit mod details' })
  @Guard(IsAdmin)
  async edit_mod(
    @SlashOption({
      autocomplete: (interaction: AutocompleteInteraction) => {
        const mods: Mod[] = db.get('mods') || [];
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
    const mods: Mod[] = db.get('mods');
    const selectedMod = mods.find((m) => m.name === mod);

    if (selectedMod === undefined) {
      interaction.reply('Mod not found in database.');
      return;
    }

    const modal = new ModalBuilder()
      .setTitle(`Edit *${selectedMod.name}* Details`)
      .setCustomId(`edit_mod_modal-${mod}`);

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

  @ModalComponent({ id: /^edit_mod_modal-.*/ })
  async EditModForm(interaction: ModalSubmitInteraction): Promise<void> {
    // Extract the original mod name from the custom ID
    const originalModName = interaction.customId.replace('edit_mod_modal-', '');

    const [name, github, modrinth, curseforge] = [
      'nameField',
      'githubField',
      'modrinthField',
      'curseforgeField',
    ].map((id) => interaction.fields.getTextInputValue(id));

    const mods: Mod[] = db.get('mods');
    const modIndex = mods.findIndex((m) => m.name === originalModName);

    if (modIndex === -1) {
      interaction.reply('Mod not found in database.');
      return;
    }

    // Update the mod in the array
    const selectedMod = mods[modIndex];
    selectedMod.name = name || selectedMod.name;
    selectedMod.gitHubOwner = github.split('/')[0] || selectedMod.gitHubOwner;
    selectedMod.gitHubRepo = github.split('/')[1] || selectedMod.gitHubRepo;
    selectedMod.modrinthId = modrinth || selectedMod.modrinthId;
    selectedMod.curseforgeId = curseforge || selectedMod.curseforgeId;

    // Save the updated mods array back to the database
    db.set('mods', mods);

    interaction.reply(`Successfully updated mod: ${selectedMod.name}`);
  }

  @Slash({ description: 'Check set-up mods' })
  @Guard(IsAdmin)
  async get_mods(interaction: CommandInteraction): Promise<void> {
    const mods: Mod[] = db.get('mods');

    for (const mod of mods) {
      console.log(mod);
    }

    interaction.reply('This command is not yet implemented.');
  }
}
