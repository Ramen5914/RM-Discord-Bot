import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GuildEntity } from './Guild.js';

@Entity('mod')
export class ModEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  gitHubOwner: string | null;

  @Column({ type: 'varchar', nullable: true })
  gitHubRepo: string | null;

  @Column({ type: 'varchar', nullable: true })
  modrinthId: string | null;

  @Column({ type: 'varchar', nullable: true })
  curseforgeId: string | null;

  @Column({ type: 'int', nullable: true })
  categoryId: number | null;

  @Column({ type: 'int', nullable: true })
  announcementChannelId: number | null;

  @Column({ type: 'int', nullable: true })
  infoChannelId: number | null;

  @Column({ type: 'int', nullable: true })
  githubChannelId: number | null;

  @Column({ type: 'int', nullable: true })
  collaboratorChannelId: number | null;

  @Column({ type: 'int', nullable: true })
  suggestionsChannelId: number | null;

  @Column({ type: 'int', nullable: true })
  supportChannelId: number | null;

  @ManyToOne(() => GuildEntity, (guild) => guild.mods)
  // @Column({ type: 'varchar', length: 19 })
  guild: GuildEntity;
}
