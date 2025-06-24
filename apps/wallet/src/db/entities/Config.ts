import { ConfigType } from '@minotaur-ergo/types';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

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
