import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity({name: 'block'})
@Unique("block_id_in_network", ["block_id", "network_type"])
class Block {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column('text')
    block_id: string = '';

    @Column('text')
    network_type: string = '';

    @Column('int', {unique: true})
    height: number = 0;
}

export default Block;
