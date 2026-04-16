import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column({ type: 'text', unique: true, name: 'address' })
  address: string = '';

  @Column({ type: 'integer', name: 'required_signatures' })
  requiredSignatures: number = 0;

  @Column({ type: 'text', nullable: true, name: 'name' })
  name: string = '';

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
}
