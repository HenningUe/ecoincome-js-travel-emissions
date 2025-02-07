import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {getCO2EmissionKgTotalPerPerson} from '@app/travel-emission-calc';
import {
  getCO2EmissionSinglePersonDto,
  getCO2EmissionPerDateRangeDto, addTravelRecordDto } from './dto/travel-emission.dto';
import { Company, TravelRecord } from './entities/travel-emission.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(TravelRecord)
    private travelRecordRepository: Repository<TravelRecord>,
  ) {}

  async getCO2EmissionKgTotalPerPerson(paramDto: getCO2EmissionSinglePersonDto): Promise<number> {
    console.log("paramDto: ", paramDto);
    const rtnData = await getCO2EmissionKgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
    return rtnData.get('emissionCO2') ?? 0;
  }

  async getCO2EmissionKgPerDateRange(
    paramDto: getCO2EmissionPerDateRangeDto,
  ): Promise<number> {
    console.log("paramDto: ", paramDto);
    const c_name: string = paramDto.company;
    let company: Company | null = await this.companyRepository.findOne(
      { where: { name: c_name } });
    if (!company) {
      const msg: string = (`The company ${company} does not exist` )
      throw new HttpException(msg, HttpStatus.NOT_FOUND);
    }
    let dateBegin = !paramDto.dateBegin ? new Date("0001-01-01") : new Date(paramDto.dateBegin);
    let dateEnd = !paramDto.dateEnd ? new Date("9999-12-31") : new Date(paramDto.dateEnd);
    let whereCondition: any = {
      //company: company,
      travelDate: Between(dateBegin, dateEnd),
      relations: ["company"]
    };
    if (paramDto.transportationMode) {
      whereCondition.TransportationMode = paramDto.transportationMode;
    }
    const results = await this.travelRecordRepository.find(whereCondition);
    const emissionCO2Kg = results.reduce((sum, current) => sum + current.emissionCO2, 0);
    return emissionCO2Kg;
  }


  async addTravelRecord(paramDto: addTravelRecordDto) {
    console.debug("paramDto: ", paramDto);
    const rtnData = await getCO2EmissionKgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
    const distanceKm: number = rtnData.get('distanceKm') ?? 0;
    const emissionCO2: number = rtnData.get('emissionCO2') ?? 0;

    const c_name: string = paramDto.company;
    let company: Company | null = await this.companyRepository.findOne(
      { where: { name: c_name } });
    if (!company) {
      company = this.companyRepository.create({ name: c_name });
      await this.companyRepository.save(company);
    }

    let travelRecord: TravelRecord = this.travelRecordRepository.create({
      company: company,
      distanceKm: distanceKm,
      transportationMode: paramDto.transportationMode,
      travelDate: paramDto.travelDate,
      origin: paramDto.origin,
      destination: paramDto.destination,
      emissionCO2: emissionCO2,
    });

    if (!company.travelRecords) {
      company.travelRecords = [];
    }
    company.travelRecords.push(travelRecord);
    await this.travelRecordRepository.save(travelRecord);
    return "OK";
  }
}
