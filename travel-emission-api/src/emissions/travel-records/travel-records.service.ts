import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getEmissionCO2KgPerDistanceInKm, getEmissionCO2KgTotalPerPerson,
  TransportationMode} from '@app/travel-emission-calc';
import {
  AddTravelRecordByOriginAndDestDto, AddTravelRecordByDistanceDto,
} from './../../dto/travel-emission.dto';
import { CompanyEntity, TravelRecordEntity } from './../../entities/travel-emission.entity';


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

    let companyObj: CompanyEntity | null = await this.companyRepository.findOne(
      { where: { name: company_name } });
    if (!companyObj) {
      companyObj = this.companyRepository.create({ name: company_name });
      await this.companyRepository.save(companyObj);
    }

    let travelRecord: TravelRecordEntity = this.travelRecordRepository.create({
      company: companyObj,
      distanceKm: distanceKm,
      transportationMode: transportationMode,
      travelDate: travelDate,
      origin: origin,
      destination: destination,
      emissionCO2: emissionCo2Kg,
    });

    if (!companyObj.travelRecords) {
      companyObj.travelRecords = [];
    }
    companyObj.travelRecords.push(travelRecord);
    await this.travelRecordRepository.save(travelRecord);
    return "OK";
  }


}
