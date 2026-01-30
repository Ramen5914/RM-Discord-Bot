import 'reflect-metadata';
import { dirname, importx } from '@discordx/importer';
import 'dotenv/config';
import { bot } from './bot.js';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import path from 'path';
import { initializeScheduler } from './scheduler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME || 'discord_data',
  entities: [path.join(__dirname, 'entity', '*.js')],
  synchronize: true,
  logging: false,
});

async function run() {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error(error);
  }

  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  initializeScheduler(bot, AppDataSource);

  if (!process.env.BOT_TOKEN) {
    throw Error('Could not find BOT_TOKEN in your environment');
  }

  await bot.login(process.env.BOT_TOKEN);
}

void run();
