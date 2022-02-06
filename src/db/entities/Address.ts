import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn, Unique
} from "typeorm";
import Wallet from './Wallet';

@Entity({name: "address"})
@Unique('address_network_type', ['address', 'network_type'])
class Address {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column('text')
    name: string = '';

    @Column('text')
    address: string = '';

    @Column("text")
    network_type: string = '';

    @Column('text')
    path: string = '';

    @Column('int', { default: -1 })
    idx: number = -1;

    @ManyToOne(() => Wallet)
    wallet: Wallet | null = null;

    @Column('int', { default: 0 })
    tx_load_height: number = 0;

    @Column('int', { default: 0 })
    tx_create_box_height: number = 0;

    @Column('int', { default: 0 })
    tx_spent_box_height: number = 0;
}

export default Address;
