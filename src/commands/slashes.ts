import { Discord } from 'discordx';
@Discord()
export class Slashes {
  // @Slash({ description: 'Get total mod downloads' })
  // async get_downloads(
  //   @SlashOption({
  //     autocomplete: (interaction: AutocompleteInteraction) => {
  //       const mods = db.get('mods');
  //       const focused = interaction.options.getFocused();
  //       const filtered = mods
  //         .filter((mod: Mod) => mod.name.toLowerCase().includes(focused.toLowerCase()))
  //         .slice(0, 25)
  //         .map((mod: Mod) => ({ name: mod.name, value: mod.name }));
  //       interaction.respond(filtered);
  //     },
  //     description: 'Mod to get downloads for',
  //     name: 'mod',
  //     required: true,
  //     type: ApplicationCommandOptionType.String,
  //   })
  //   mod: string,
  //   interaction: CommandInteraction,
  // ): Promise<void> {
  //   const mods: Mod[] = db.get('mods') || [];
  //   const selectedMod = mods.find((m) => m.name === mod);
  //   if (selectedMod === undefined) {
  //     interaction.reply('Mod not found in database.');
  //     return;
  //   }
  //   let totalDownloads: number = 0;
  //   let color: number = 0xffffff;
  //   let cfDownloads: string | number;
  //   if (!selectedMod.curseforgeId) {
  //     cfDownloads = 'N/A';
  //   } else {
  //     const res = await getMod(selectedMod.curseforgeId);
  //     cfDownloads = res.data.downloadCount;
  //     totalDownloads += cfDownloads;
  //   }
  //   let mDownloads: string | number;
  //   if (!selectedMod.modrinthId) {
  //     mDownloads = 'N/A';
  //   } else {
  //     const res = await getProject(selectedMod.modrinthId);
  //     if (res.color) {
  //       color = res.color;
  //     }
  //     mDownloads = res.downloads;
  //     totalDownloads += mDownloads;
  //   }
  //   let gDownloads: number = 0;
  //   const res = await listReleases(selectedMod.gitHubOwner, selectedMod.gitHubRepo);
  //   for (const releases of res) {
  //     for (const assets of releases.assets) {
  //       gDownloads += assets.download_count;
  //     }
  //   }
  //   totalDownloads += gDownloads;
  //   interaction.reply({
  //     embeds: [
  //       new EmbedBuilder()
  //         .setTitle('Downloads')
  //         .setDescription('Downloads across platforms')
  //         .setColor(color)
  //         .addFields(
  //           { name: 'CurseForge', value: `${cfDownloads}`, inline: true },
  //           { name: 'Modrinth', value: `${mDownloads}`, inline: true },
  //           { name: 'GitHub', value: `${gDownloads}`, inline: true },
  //           {
  //             name: 'Total',
  //             value: `${totalDownloads}`,
  //             inline: true,
  //           },
  //         )
  //         .setTimestamp(),
  //     ],
  //   });
  // }
}
