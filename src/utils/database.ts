import { AutocompleteInteraction } from 'discord.js';
import { AppDataSource } from '../main.js';
import { GuildEntity } from '../entity/Guild.js';
import { ModEntity } from '../entity/Mod.js';

export async function autocompleteModNames(interaction: AutocompleteInteraction): Promise<void> {
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
}

export async function getGuildById(id: string): Promise<GuildEntity | null> {
  const guildRepository = AppDataSource.manager.getRepository(GuildEntity);
  return await guildRepository.findOneBy({ id: id });
}

export async function getModByGuildAndName(guild: GuildEntity, name: string) {
  const modRepository = AppDataSource.manager.getRepository(ModEntity);
  return await modRepository.findOneBy({ guild: guild, name: name });
}
