import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getEmissionCO2KgPerDistanceInKm, getEmissionCO2KgTotalPerPerson,
  TransportationMode} from '@app/travel-emission-calc';
import {
  AddTravelRecordByOriginAndDestDto, AddTravelRecordByDistanceDto,
} from '../../../dtos/travel-emission.dto';
import { CompanyEntity, TravelRecordEntity } from '../../../database/entities/travel-emission.entity';


@Injectable()
export class TravelRecordsService {
  /**
   * Business logic for handling of travel records.
   * Methods inside this class are called by the TravelRecordsController.
   * Business logic in this class basically consists of adding travel records to the database.
   * 
   * @param companyRepository - Database-repository for the CompanyEntity
   * @param travelRecordRepository  - Database-repository for the TravelRecordEntity
   */

  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
    @InjectRepository(TravelRecordEntity)
    private travelRecordRepository: Repository<TravelRecordEntity>,
  ) {}

  async addTravelRecordByOriginAndDst(paramDto: AddTravelRecordByOriginAndDestDto) {
    console.debug("paramDto: ", paramDto);
    const rtnData = await getEmissionCO2KgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
    const distanceKm: number = rtnData.distanceKm ?? 0;

    return this.addTravelRecord(
      paramDto.company, paramDto.transportationMode,
      paramDto.travelDate, distanceKm,
      paramDto.origin, paramDto.destination);
  }

  async addTravelRecordByDistance(paramDto: AddTravelRecordByDistanceDto) {
    console.debug("paramDto: ", paramDto);
    return this.addTravelRecord(
      paramDto.company, paramDto.transportationMode,
      paramDto.travelDate, paramDto.distance);
  }

  async getCompanyNames() {
    const companies = await this.companyRepository.find();
    return companies.map((company) => company.name);
  }
  
  private async addTravelRecord(
    company_name: string,
    transportationMode: TransportationMode,
    travelDate: Date,
    distanceKm: number,
    origin: string | undefined = undefined,
    destination: string | undefined = undefined,
  ) {
    const emissionCo2Kg = await getEmissionCO2KgPerDistanceInKm(transportationMode, distanceKm);

    await this.companyRepository.manager.transaction(async (manager) => {
      let companyEntity: CompanyEntity | null = await manager.findOne(
        CompanyEntity,
        { where: { name: company_name },
          relations: ["travelRecords"] })
      if (!companyEntity) {
        companyEntity = this.companyRepository.create({ name: company_name });
      }

      let travelRecordEntity = this.travelRecordRepository.create({
        company: companyEntity,
        distanceKm: distanceKm,
        transportationMode: transportationMode,
        travelDate: travelDate,
        origin: origin,
        destination: destination,
        emissionCO2: emissionCo2Kg,
      });
      //await this.travelRecordRepository.save(travelRecordEntity);
      if (!companyEntity.travelRecords) {
        companyEntity.travelRecords = [];
      }
      travelRecordEntity.company = companyEntity
      companyEntity.travelRecords.push(travelRecordEntity);
      await manager.save(companyEntity);
      await manager.save(travelRecordEntity);
  
    });
  }
}
