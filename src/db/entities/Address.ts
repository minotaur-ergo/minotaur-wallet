import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import Wallet from './Wallet';

@Entity({name: "address"})
class Address {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column('text')
    name: string = '';

    @Column('text', { unique: true })
    address: string = '';

    @Column('text')
    path: string = '';

    @Column('int', { default: -1 })
    idx: number = -1;

    @ManyToOne(() => Wallet)
    wallet: Wallet | null = null;

    @Column('boolean', {default: false})
    is_new: boolean = false;
}

export default Address;
