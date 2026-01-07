import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  gitHubOwner: string | null;

  @Column({ nullable: true })
  gitHubRepo: string | null;

  @Column({ nullable: true })
  modrinthId: string | null;

  @Column({ nullable: true })
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
}
