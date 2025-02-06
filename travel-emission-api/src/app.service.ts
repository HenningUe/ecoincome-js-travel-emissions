import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { getCO2EmissionDto, addTravelRecordDto } from './travel-emission.dto';
import { getCO2EmissionKgTotalPerPerson} from '@app/travel-emission-calc';
import { Company, TravelRecord } from './entities/travel-emission.entity';


export class CompanyRepository extends Repository<Company> {}
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
    console.debug("paramDto: ", paramDto);
    return getCO2EmissionKgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
  }

  async addTravelRecord(paramDto: addTravelRecordDto) {
    console.debug("paramDto: ", paramDto);
    const emission = await getCO2EmissionKgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
    const c_name: string = paramDto.company;
    let company = await this.companyRepository.findOne({ where: { c_name } });
    if (!company) {
      company = this.companyRepository.create({ c_name });
      await this.companyRepository.save(company);
    }
    console.debug("emission: ", emission);
  }
}
