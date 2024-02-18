import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'saved-address' })
class SavedAddress {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  address = '';

  @Column('text')
  name = '';
}

export default SavedAddress;
