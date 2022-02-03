import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Address from "./Address";
import Tx from "./Tx";
import BigIntValueTransformer from "./Transformer";

@Entity({ name: "box" })
class Box {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @ManyToOne(type => Address)
    address: Address | null = null;

    @ManyToOne(type => Tx)
    tx: Tx | null = null;

    @ManyToOne(type => Tx, { nullable: true })
    spend_tx: Tx | null = null;

    @Column("text", { unique: true })
    box_id: string = "";

    @Column("text", { transformer: new BigIntValueTransformer() })
    erg: bigint = BigInt(0);

    @Column("int")
    create_index: number = 0;

    @Column("int")
    create_height: number = 0;

    @Column("int", { nullable: true })
    spend_index: number = 0;

    @Column("int", { nullable: true })
    spend_height: number = 0;

    @Column("text")
    json: string = "";
}


export default Box;
