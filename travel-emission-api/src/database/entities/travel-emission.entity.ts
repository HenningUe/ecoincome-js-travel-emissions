import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TransportationMode } from '@app/travel-emission-calc';


@Entity({ name: 'Company' })
export class CompanyEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 300, unique: true })
  name: string;

  @OneToMany(() => TravelRecordEntity, (travel) => travel.company)
  travelRecords: TravelRecordEntity[];

  constructor(name: string | undefined = undefined) {
    super();
    if (name != undefined) {
      this.name = name}
  }
}

@Entity({ name: 'TravelRecord' })
export class TravelRecordEntity extends BaseEntity {

  @ManyToOne(() => CompanyEntity, (company) => company.travelRecords)
  company: CompanyEntity;

  @Column({type: "float"})
  distanceKm: number;

  @Column({type: "float"})
  emissionCO2: number;

  @Column({
    //type: 'enum',
    enum: TransportationMode
  })
  transportationMode: TransportationMode;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  travelDate: Date;

  @Column({ type: 'varchar', length: 300, nullable: true})
  origin: string;

  @Column({ type: 'varchar', length: 300, nullable: true})
  destination!: string;
}



//https://medium.com/@kavindapvt/comprehensive-guide-to-using-typeorm-in-nestjs-0f3bd7cdfdb6
//https://medium.com/@mandipsapkota/using-postgresql-in-codespaces-e1ae1aa50258

//https://github.com/GauSim/nestjs-typeorm

//https://medium.com/@gausmann.simon/nestjs-typeorm-and-postgresql-full-example-development-and-project-setup-working-with-database-c1a2b1b11b8f
