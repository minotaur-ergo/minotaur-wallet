import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export enum ConfigType {
  DisplayMode = 'DISPLAY_DETAIL',
  Currency = 'CURRENCY',
  ActiveWallet = 'ACTIVE_WALLET',
  useActiveWallet = 'USE_ACTIVE_WALLET',
}

@Entity({ name: 'config' })
@Unique(['key', 'pinType'])
class Config {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  key: string = ConfigType.DisplayMode;

  @Column('text', { default: '' })
  pinType: string = '';

  @Column('text')
  value = '';
}

export default Config;
