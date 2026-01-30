import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GuildEntity } from './Guild.js';
import type { ManagedMessageEntity } from './ManagedMessage.js';

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

  @Column({ type: 'varchar', length: 19, nullable: true })
  categoryId: string | null;

  @Column({ type: 'varchar', length: 19, nullable: true })
  announcementChannelId: string | null;

  @Column({ type: 'varchar', length: 19, nullable: true })
  infoChannelId: string | null;

  @Column({ type: 'varchar', length: 19, nullable: true })
  githubChannelId: string | null;

  @Column({ type: 'varchar', length: 19, nullable: true })
  chatChannelId: string | null;

  @Column({ type: 'varchar', length: 19, nullable: true })
  collaboratorChannelId: string | null;

  @Column({ type: 'varchar', length: 19, nullable: true })
  suggestionsChannelId: string | null;

  @Column({ type: 'varchar', length: 19, nullable: true })
  supportChannelId: string | null;

  @Column({ type: 'varchar', nullable: true })
  homepageUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  wikiUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  issuesUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  sourceUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  curseforgeUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  modrinthUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  githubRepoUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  githubProjectBoardUrl: string | null;

  @OneToMany('ManagedMessageEntity', (managedMessage: ManagedMessageEntity) => managedMessage.mod)
  managedMessages: ManagedMessageEntity[];

  @ManyToOne(() => GuildEntity)
  guild: GuildEntity;
}
