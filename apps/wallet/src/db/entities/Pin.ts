import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pin' })
class Pin {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text', { unique: true })
  type: string = '';

  @Column('text')
  value = '';
}

export default Pin;
