import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getCO2EmissionDto } from './travel-emission.dto';
import {getCO2EmissionKgTotalPerPerson} from '@app/travel-emission-calc';
import { Company } from './entities/travel-emission.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  async getCO2EmissionKgTotalPerPerson(paramDto: getCO2EmissionDto): Promise<number> {
    console.log("paramDto: ", paramDto);
    const c_name: string = "BMW";
    let company: Company | null = await this.companyRepository.findOne(
      { where: { name: c_name } });
    if (!company) {
      company = this.companyRepository.create({ name: c_name });
      await this.companyRepository.save(company);
    }
    console.log("company: ", company);

    const rtnData = await getCO2EmissionKgTotalPerPerson(
      paramDto.transportationMode, paramDto.origin, paramDto.destination);
    return rtnData.get('emissionCO2') ?? 0;
  }
}
