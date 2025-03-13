import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {getEmissionCO2KgTotalPerPerson} from '@app/travel-emission-calc';
import {
  GetCO2EmissionSinglePersonDto, GetCO2EmissionPerDateRangeDto,
  DateAggregationUnit,
  GetCO2EmissionAggregatedPerDateRangeResponseDto,
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
    const emmissions = await this.getCO2EmissionKgAggregatedPerDateRange(paramDto);
    const emissionCO2Kg = emmissions[0].emissionCo2InKg;
    return emissionCO2Kg;
  }

  async getCO2EmissionKgAggregatedPerDateRange(
    paramDto: GetCO2EmissionPerDateRangeDto,
    dateAggregationUnit: DateAggregationUnit | undefined = undefined,
  ): Promise<GetCO2EmissionAggregatedPerDateRangeResponseDto[]> {
    console.log("paramDto: ", paramDto);
    const c_name: string = paramDto.company;
    let company: CompanyEntity | null = await this.companyRepository.findOne(
      { where: { name: c_name } });
    if (!company) {
      const msg: string = (`The company ${paramDto.company} does not exist` )
      throw new HttpException(msg, HttpStatus.NOT_FOUND);
    }
    let helper = new EmissionQueryHelper(this.travelRecordRepository);
    return await helper.getCO2EmissionKgAggregatedPerDateRange(paramDto, dateAggregationUnit);
  }
}


class EmissionQueryHelper {
  private travelRecordRepository: Repository<TravelRecordEntity>
  private aggregateBy: string

  constructor(
    travelRecordRepository: Repository<TravelRecordEntity>    
  ) {
    this.travelRecordRepository = travelRecordRepository;
    this.aggregateBy = "TS";
  }

  public async getCO2EmissionKgAggregatedPerDateRange(
    paramDto: GetCO2EmissionPerDateRangeDto,
    dateAggregationUnit: DateAggregationUnit | undefined = undefined,
  ): Promise<GetCO2EmissionAggregatedPerDateRangeResponseDto[]> {    
    const results = await this.getQueryResult(paramDto);
    const returnData = await this.aggregateAndConvertQueryResult(results, dateAggregationUnit);
    return returnData
  }

  private async getQueryResult(
    paramDto: GetCO2EmissionPerDateRangeDto
  ) {
    let dateBegin = !paramDto.dateBegin ? new Date("0001-01-01") : new Date(paramDto.dateBegin);
    let dateEnd = !paramDto.dateEnd ? new Date("9999-12-31") : new Date(paramDto.dateEnd);
    let whereCondition: any = {
      company:  { name: paramDto.company },
      travelDate: Between(dateBegin, dateEnd),
    };
    if (paramDto.transportationMode) {
      whereCondition.transportationMode = paramDto.transportationMode;
    }
    let results;
    if (this.aggregateBy == "TS") {
      results = await this.travelRecordRepository.find({
        where: whereCondition,
        relations: ["company"],
      });
      
    }
    else if (this.aggregateBy == "SQL") {
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


  private async aggregateAndConvertQueryResult(
    results: any,
    dateAggregationUnit: DateAggregationUnit | undefined,
  ): Promise<GetCO2EmissionAggregatedPerDateRangeResponseDto[]>  {
  }
}