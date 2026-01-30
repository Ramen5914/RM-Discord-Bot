import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import type { ModEntity } from './Mod.js';

export enum MessageType {
  MOD_INFO = 'modInfo',
}

@Entity('managed_message')
export class ManagedMessageEntity {
  @PrimaryColumn({ type: 'varchar', length: 19 })
  id: string;

  @Column({
    type: 'enum',
    enum: MessageType,
  })
  type: MessageType;

  @ManyToOne('ModEntity')
  mod: ModEntity;
}
