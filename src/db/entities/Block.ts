import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'block'})
class Block {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column('text', { unique: true })
    block_id: string = '';

    @Column('int', {unique: true})
    height: number = 0;
}

export default Block;
