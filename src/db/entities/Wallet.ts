import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum WalletType {
    Cold = 'COLD',
    ReadOnly = 'READ_ONLY',
    Normal = 'NORMAL',
    MultiSig = 'MULTI_SIG',
}

@Entity({name:"wallet"})
class Wallet {

    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column('text')
    name: string = '';

    @Column("text")
    network_type: string = '';

    @Column("text")
    seed: string = '';

    @Column("text")
    extended_public_key: string = '';

    @Column('text')
    type: WalletType = WalletType.Normal;
}


export default Wallet;

export {
    WalletType,
};
