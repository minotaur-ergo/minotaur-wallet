import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


enum TxStatus {
    Mined = 'MINED',
    MemPool = 'MEM_POOL',
    Forked = 'FORKED',
    New = 'New'
}


@Entity({name: 'tx'})
class Tx {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column('text', { unique: true })
    tx_id: string = '';

    @Column('int')
    height: number = 0;

    @Column("text")
    network_type: string = '';

    @Column('int')
    date: number = 0;

    @Column('text')
    status: TxStatus = TxStatus.Mined;
}

export default Tx;

export {
    TxStatus,
};
