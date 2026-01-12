import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import type { ModEntity } from './Mod.js';

export enum MessageType {
  DOWNLOAD_INFO = 'downloadInfo',
}

@Entity()
export class ManagedMessageEntity {
  @PrimaryColumn({ type: 'varchar', length: 19 })
  id: string;

  @Column({
    type: 'enum',
    enum: MessageType,
  })
  type: MessageType;

  @ManyToOne('ModEntity', 'managedMessages')
  mod: ModEntity;
}
