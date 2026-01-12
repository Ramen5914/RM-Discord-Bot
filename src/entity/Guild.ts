import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('guild')
export class GuildEntity {
  @PrimaryColumn({ type: 'varchar', length: 19 })
  id: string;

  @Column({ type: 'varchar', length: 19 })
  moderatorRoleId: string;
}
