import Wallet from '@/db/entities/Wallet';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'server' })
class Server {
  @PrimaryGeneratedColumn()
  id = 0;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  wallet: Wallet | null = null;

  @Column('text')
  address: string = '';

  @Column('text')
  secret = '';

  @Column('text')
  public = '';

  @Column('text', { nullable: true })
  teamId = '';
}

export default Server;
