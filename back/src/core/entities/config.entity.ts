import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Exclude } from "class-transformer";

@Entity('fabrique_config')
export class FabriqueConfig {
  @PrimaryColumn({type: 'int', default: () => `1`, nullable: false})
  @Exclude()
  id = 1;

  @Column({length: 200})
  elastic_host: string;

  @Column({length: 200})
  elastic_username: string;

  @Column({length: 200})
  elastic_password: string;

  @Column({length: 200})
  elastic_metricbeat_index: string;

  @Column({length: 200})
  elastic_packetbeat_index: string;

  @Column({length: 200})
  elastic_filebeat_index: string;
}
