import 'reflect-metadata';
import { dirname, importx } from '@discordx/importer';
import 'dotenv/config';
import { bot } from './bot.js';
import { DataSource } from 'typeorm';
import { Mod } from './entity/Mod.js';

async function run() {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'admin',
    password: 'secret',
    database: 'discord_data',
    entities: [Mod],
    synchronize: true,
    logging: false,
  });

  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error(error);
  }

  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error('Could not find BOT_TOKEN in your environment');
  }

  await bot.login(process.env.BOT_TOKEN);
}

void run();
