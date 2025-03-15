import { format, startOfWeek} from "date-fns";
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import {getEmissionCO2KgTotalPerPerson} from '@app/travel-emission-calc';
import {
  GetCO2EmissionSinglePersonDto, GetEmissionCO2PerDateRangeDto,
  DatePeriodUnit,
  GetEmissionCO2PerDateRangeAggregatedResponseDto,
} from '../dto/travel-emission.dto';
import {
  CompanyEntity, TravelRecordEntity 
 } from '../../database/entities/travel-emission.entity';

@Injectable()
export class EmissionsService {

  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
    @InjectRepository(TravelRecordEntity)
    private travelRecordRepository: Repository<TravelRecordEntity>,
  ) {}

  async getEmissionCO2KgTotalPerPerson(paramDto: GetCO2EmissionSinglePersonDto): Promise<number> {
    console.log("paramDto: ", paramDto);
    const rtnData = await getEmissionCO2KgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
    return rtnData.get('emissionCO2') ?? 0;
  }

  async getEmissionCO2KgPerDateRange(
    paramDto: GetEmissionCO2PerDateRangeDto,
  ): Promise<number> {
    console.log("paramDto: ", paramDto);
    const emmissions = await this.getEmissionCO2InKgAggregatedPerDateRange(paramDto);
    const emissionCO2Kg = emmissions[0].emissionCo2InKg;
    return emissionCO2Kg;
  }

  async getEmissionCO2InKgAggregatedPerDateRange(
    paramDto: GetEmissionCO2PerDateRangeDto,
    datePeriodUnit: DatePeriodUnit | undefined = undefined,
  ): Promise<GetEmissionCO2PerDateRangeAggregatedResponseDto[]> {
    console.log("paramDto: ", paramDto);
    const c_name: string = paramDto.company;
    let company: CompanyEntity | null = await this.companyRepository.findOne(
      { where: { name: c_name } });
    if (!company) {
      const msg: string = (`The company ${paramDto.company} does not exist` )
      throw new HttpException(msg, HttpStatus.NOT_FOUND);
    }
    let helper = new EmissionQueryHandler(this.companyRepository, this.travelRecordRepository);
    return await helper.getEmissionCO2InKgPerDateRangeAggregated(paramDto, datePeriodUnit);
  }
}


class EmissionQueryHandler {
  private companyRepository: Repository<CompanyEntity>
  private travelRecordRepository: Repository<TravelRecordEntity>
  private aggregateStrategy: string

  constructor(
    companyRepository: Repository<CompanyEntity>,
    travelRecordRepository: Repository<TravelRecordEntity>    
  ) {
    this.companyRepository = companyRepository;
    this.travelRecordRepository = travelRecordRepository;
    this.aggregateStrategy = "TS";
  }

  public async getEmissionCO2InKgPerDateRangeAggregated(
    paramDto: GetEmissionCO2PerDateRangeDto,
    datePeriodUnit: DatePeriodUnit | undefined = undefined,
  ): Promise<GetEmissionCO2PerDateRangeAggregatedResponseDto[]> {    
    const results = await this.getQueryResult(paramDto);
    const returnData = await this.groupAndConvertQueryResult(datePeriodUnit, results);
    return returnData
  }

  private async getQueryResult(
    paramDto: GetEmissionCO2PerDateRangeDto
  ) {
    let dateBegin = !paramDto.dateBegin ? new Date("0001-01-01") : new Date(paramDto.dateBegin);
    let dateEnd = !paramDto.dateEnd ? new Date("9999-12-31") : new Date(paramDto.dateEnd);
    const company = await  <Promise<CompanyEntity>>this.companyRepository.findOne({where: {name: paramDto.company}})
    let whereCondition: any = {
      'company.id': company.id,
      travelDate: Between(dateBegin, dateEnd),
    };
    if (paramDto.transportationMode) {
      whereCondition.transportationMode = paramDto.transportationMode;
    }
    let results;
    if (this.aggregateStrategy == "TS") {
      results = await this.travelRecordRepository.find({
        where: whereCondition,
        relations: ["company"],
        order: { travelDate: "ASC" },
      }); 
    }
    else if (this.aggregateStrategy == "SQL") {
      //Note: groupby in SQL is faster than groupby in TS.
      //Major drawback: more difficult to debug and mock.
      //Thus: open als fallback in case performance is an issue
      results = await (
        this.travelRecordRepository.createQueryBuilder('travelRecord')           
        .addSelect("DATEPART (week, travelDate) AS GroupByNumber" )
        .leftJoinAndSelect("travelRecord.company", "company")
        .where(whereCondition) 
        .groupBy("GroupByNumber")
        .orderBy('travelDate', 'DESC')         
        .getRawMany()
      );
    }
    return results;
  }

  
  private async groupAndConvertQueryResult(
    datePeriodUnit: DatePeriodUnit | undefined,
    results: any[]): Promise<GetEmissionCO2PerDateRangeAggregatedResponseDto[]> {
    let groupedResults = new Map<string, GetEmissionCO2PerDateRangeAggregatedResponseDto>()
    let getPeriodStart;
    if (datePeriodUnit == DatePeriodUnit.Week) {
      // weekStartsOn: 1 = Monday
      getPeriodStart = (date: Date) => startOfWeek(date, { weekStartsOn: 1 });
    }
    else if (datePeriodUnit == DatePeriodUnit.Month) {
      getPeriodStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);;
    }
    else if (datePeriodUnit == DatePeriodUnit.Year) {
      getPeriodStart = (date: Date) => new Date(date.getFullYear(), 1, 1);
    }
    else {
      getPeriodStart = (date: Date) => results? results[0].travelDate : new Date(1, 1, 1);
    }

    let minPeriodStart: Date = new Date(1, 1, 1);
    for(let i=0; i<results.length; i++){
      const item = results[i];
      let periodStartDate: Date = <Date>item.travelDate;
      if (i == 0) {
        minPeriodStart = periodStartDate;
      }
      else if (i > 0) {
        periodStartDate = getPeriodStart(item.travelDate);
      }
      if (periodStartDate < minPeriodStart) {
        periodStartDate = minPeriodStart;
      }
      let periodStartDateString = format(periodStartDate, 'yyyy-MM-dd')
      if (!groupedResults.has(periodStartDateString)) {
        groupedResults.set(periodStartDateString,
          new GetEmissionCO2PerDateRangeAggregatedResponseDto(periodStartDate, 0));
      }
      const group = groupedResults.get(periodStartDateString);
      if (group) {
        group.emissionCo2InKg += item.emissionCO2;
      }
    }
    return Promise.resolve(Array.from(groupedResults.values()));
  }
  }