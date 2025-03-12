import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {getEmissionCO2KgTotalPerPerson} from '@app/travel-emission-calc';
import {
  GetCO2EmissionSinglePersonDto, GetCO2EmissionPerDateRangeDto,
  GetCO2EmissionAggregatedPerDateRangeDto,
} from './../dto/travel-emission.dto';
import { CompanyEntity, TravelRecordEntity } from './../entities/travel-emission.entity';

@Injectable()
export class EmissionsService {

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

  async getCO2EmissionKgAggregatedPerDateRange(
    paramDto: GetCO2EmissionAggregatedPerDateRangeDto,
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



}
