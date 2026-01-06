import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mod {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  gitHubOwner: string;
  @Column()
  gitHubRepo: string;
  @Column()
  modrinthId: string;
  @Column()
  curseforgeId: string;
  @Column('int')
  categoryId: number;
  @Column('int')
  announcementChannelId: number;
  @Column('int')
  infoChannelId: number;
  @Column('int')
  githubChannelId: number;
  @Column('int')
  collaboratorChannelId: number;
  @Column('int')
  suggestionsChannelId: number;
  @Column('int')
  supportChannelId: number;
}
