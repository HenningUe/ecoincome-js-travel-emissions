import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getEmissionCO2KgPerDistanceInKm, getEmissionCO2KgTotalPerPerson,
  TransportationMode} from '@app/travel-emission-calc';
import {
  AddTravelRecordByOriginAndDestDto, AddTravelRecordByDistanceDto,
} from '../../dto/travel-emission.dto';
import { CompanyEntity, TravelRecordEntity } from '../../../database/entities/travel-emission.entity';


@Injectable()
export class TravelRecordsService {

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
    const distanceKm: number = rtnData.get('distanceKm') ?? 0;

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
  
  private async addTravelRecord(
    company_name: string,
    transportationMode: TransportationMode,
    travelDate: Date,
    distanceKm: number,
    origin: string | undefined = undefined,
    destination: string | undefined = undefined,
  ) {
    const emissionCo2Kg = await getEmissionCO2KgPerDistanceInKm(transportationMode, distanceKm);

    await this.companyRepository.manager.transaction(async manager => {
      let companyEntity: CompanyEntity | null = await manager.findOne(CompanyEntity,
        { where: { name: company_name } });
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
