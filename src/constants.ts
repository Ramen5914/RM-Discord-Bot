import { CategoryChannel, MediaChannel, NewsChannel, TextChannel } from 'discord.js';

export const mModId: string = 'FMcIBFPB';
export const cModId: string = '1399042';

export type Mod = {
  name: string;
  gitHubOwner: string;
  gitHubRepo: string;
  modrinthId?: string;
  curseforgeId?: string;
  category?: CategoryChannel;
  announcementChannel?: NewsChannel;
  infoChannel?: TextChannel;
  githubChannel?: TextChannel;
  collaboratorChannel?: TextChannel;
  suggestionsChannel?: MediaChannel;
  supportChannel?: MediaChannel;
};
