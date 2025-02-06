import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getCO2EmissionDto, addTravelRecordDto } from './travel-emission.dto';
import { getCO2EmissionKgTotalPerPerson} from '@app/travel-emission-calc';
import { Company, TravelRecord } from './entities/travel-emission.entity';

@Injectable() 
export class CompanyRepository extends Repository<Company> {}

@Injectable() 
export class TravelRecordRepository extends Repository<TravelRecord> {}


@Injectable()
export class AppService {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
    @InjectRepository(TravelRecordRepository)
    private readonly travelRecordRepository: TravelRecordRepository,
  ) {}

  async getCO2EmissionKgTotalPerPerson(paramDto: getCO2EmissionDto): Promise<number> {
    //console.debug("paramDto: ", paramDto);
    const rtnData = await getCO2EmissionKgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
    return rtnData.get('emissionCO2') ?? 0;
  }

  async addTravelRecord(paramDto: addTravelRecordDto) {
    //console.debug("paramDto: ", paramDto);

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
  }
}
