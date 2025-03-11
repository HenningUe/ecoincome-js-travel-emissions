import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  getEmissionCO2KgPerDistanceInKm, getEmissionCO2KgTotalPerPerson,
  TransportationMode} from '@app/travel-emission-calc';
import {
  GetCO2EmissionSinglePersonDto, GetCO2EmissionPerDateRangeDto, 
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

  async getCO2EmissionKgTotalPerPerson(paramDto: GetCO2EmissionSinglePersonDto): Promise<number> {
    console.log("paramDto: ", paramDto);
    const rtnData = await getEmissionCO2KgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
    return rtnData.get('emissionCO2') ?? 0;
  }

  async getCO2EmissionKgPerDateRange(
    paramDto: GetCO2EmissionPerDateRangeDto,
  ): Promise<number> {
    console.log("paramDto: ", paramDto);
    const c_name: string = paramDto.company;
    let company: CompanyEntity | null = await this.companyRepository.findOne(
      { where: { name: c_name } });
    if (!company) {
      const msg: string = (`The company ${paramDto.company} does not exist` )
      throw new HttpException(msg, HttpStatus.NOT_FOUND);
    }
    let dateBegin = !paramDto.dateBegin ? new Date("0001-01-01") : new Date(paramDto.dateBegin);
    let dateEnd = !paramDto.dateEnd ? new Date("9999-12-31") : new Date(paramDto.dateEnd);
    let whereCondition: any = {
      company:  { name: paramDto.company },
      travelDate: Between(dateBegin, dateEnd),
    };
    if (paramDto.transportationMode) {
      whereCondition.transportationMode = paramDto.transportationMode;
    }
    const results = await this.travelRecordRepository.find({
      where: whereCondition,
      relations: ["company"],
    });
    const emissionCO2Kg = results.reduce((sum, current) => sum + current.emissionCO2, 0);
    return emissionCO2Kg;
  }


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
