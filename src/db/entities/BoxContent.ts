import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import Box from './Box';
import BigIntValueTransformer from "./Transformer";

@Entity({name: "box_content"})
@Unique("token_id_in_box", ["token_id", "box"])
class BoxContent {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column('text')
    token_id: string = '';

    @Column('text', {transformer: new BigIntValueTransformer()})
    amount: bigint = BigInt(0);

    @ManyToOne(type => Box,{onDelete: "CASCADE"})
    box: Box | null = null;
}

export default BoxContent;
