import { CommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';
import { GuardFunction } from 'discordx';
import { db } from '../main.js';

export const IsMod: GuardFunction<CommandInteraction> = async (params, client, next, data) => {
  const modRoleId = db.get('modRoleId');

  const member = params.member as GuildMember | null;
  if (!member) {
    data.guardPassed = false;
    return;
  }

  const roleArray = [...member.roles.cache.keys()];
  const passed =
    roleArray.includes(modRoleId) || member.permissions.has(PermissionFlagsBits.Administrator);

  data.guardPassed = passed;

  if (passed) {
    await next();
  }
};
