import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: "asset"})
class Asset{
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column("text", {unique: true})
  asset_id: string = "";

  @Column("text", {nullable: true})
  box_id?: string = "";

  @Column("text", {nullable: true})
  name?: string = "";

  @Column("int", {nullable: true, default: 0})
  decimal?: number = 0;

  @Column("text", {nullable: true})
  description?: string = "";
}

export default Asset
