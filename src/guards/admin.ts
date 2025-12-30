import { CommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js';
import { GuardFunction } from 'discordx';

export const IsAdmin: GuardFunction<CommandInteraction> = async (params, client, next, data) => {
  const member = params.member as GuildMember | null;

  if (!member) {
    data.guardPassed = false;
    return;
  }

  const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);

  data.guardPassed = isAdmin;

  if (isAdmin) {
    await next();
  }
};
