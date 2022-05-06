import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name: 'config'})
class Config {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column('text', { unique: true })
    key: string = '';

    @Column('text')
    value: string = '';
}

export default Config;
