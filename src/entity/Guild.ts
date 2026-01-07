import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ModEntity } from './Mod.js';

@Entity('guild')
export class GuildEntity {
  @PrimaryColumn({ type: 'varchar', length: 19 })
  id: string;

  @Column({ type: 'varchar', length: 19 })
  moderatorRoleId: string;

  @OneToMany(() => ModEntity, (mod) => mod.guild)
  mods: ModEntity[];
}
