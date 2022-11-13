import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum WalletType {
  Cold = 'COLD',
  ReadOnly = 'READ_ONLY',
  Normal = 'NORMAL',
  MultiSig = 'MULTI_SIG',
}

@Entity({ name: 'wallet' })
class Wallet {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  name = '';

  @Column('text')
  network_type = '';

  @Column('text')
  seed = '';

  @Column('text')
  extended_public_key = '';

  @Column('text')
  type: WalletType = WalletType.Normal;
}

export default Wallet;

export { WalletType };
