import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

enum ProcessStatus {
  NotProceed = 'NOT_PROCEED',
  OutputProceed = 'OUTPUT_PROCEED',
  AllProceed = 'ALL_PROCEED',
}

@Entity({ name: 'block' })
@Unique('block_id_in_network', ['block_id', 'network_type'])
@Unique('height_id_in_network', ['height', 'network_type'])
class Block {
  @PrimaryGeneratedColumn()
  id = 0;

  @Column('text')
  block_id = '';

  @Column('text')
  network_type = '';

  @Column('int')
  height = 0;

  @Column('text', { default: ProcessStatus.NotProceed })
  status: ProcessStatus = ProcessStatus.NotProceed;
}

export default Block;
