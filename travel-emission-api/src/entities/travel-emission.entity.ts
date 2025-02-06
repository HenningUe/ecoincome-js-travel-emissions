import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TransportationMode } from '@app/travel-emission-calc';


@Entity()
export class Company extends BaseEntity {

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'varchar', length: 300 })
  description: string;

  @OneToMany(type => TravelRecord, travel => travel.company)
  travelRecords: TravelRecord[];
}

@Entity()
export class TravelRecord extends BaseEntity {

  @ManyToOne(type => Company, company => company.travelRecords)
  company: Company;

  @Column()
  distance_km: number;

  @Column({
    type: 'enum',
    enum: TransportationMode
  })
  transport_mode: typeof TransportationMode;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  travelDate: Date;

  @Column({ type: 'varchar', length: 300 })
  origin: string;

  @Column({ type: 'varchar', length: 300 })
  destination: string;
}



//https://medium.com/@kavindapvt/comprehensive-guide-to-using-typeorm-in-nestjs-0f3bd7cdfdb6
//https://medium.com/@mandipsapkota/using-postgresql-in-codespaces-e1ae1aa50258

//https://github.com/GauSim/nestjs-typeorm

//https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f
