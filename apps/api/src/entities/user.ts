import { bip32 } from '@minotaur/common';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['chainCode', 'keyData'])
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: 'text', name: 'chain_code' })
  chainCode: string = '';

  @Column({ type: 'text', name: 'key_data' })
  keyData: string = '';

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date = new Date();

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date = new Date();

  xPub = (): string => {
    try {
      const keyDataBuffer = Buffer.from(this.keyData, 'hex');
      const chainCodeBuffer = Buffer.from(this.chainCode, 'hex');

      const node = bip32.fromPublicKey(keyDataBuffer, chainCodeBuffer);
      return node.toBase58();
    } catch (error) {
      throw new Error(`Failed to generate xpub: ${error}`);
    }
  };
}
