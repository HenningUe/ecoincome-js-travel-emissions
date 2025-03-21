import { Test, TestingModuleBuilder, } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { databaseCfgForSqlLiteInMemory } from '../../database/configs/in-memory-database.config';
import { CompanyEntity, TravelRecordEntity } from '../../database/entities/travel-emission.entity';
import { MockFactory } from '../entities/travel-emission.entity.test-utils';
import { EmissionsController } from '../../modules/emissions/emissions.controller';
import { EmissionsService } from '../../modules/emissions/emissions.service';
import { ModuleMetadata } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TravelRecordsService } from '../../modules/emissions/travel-records/travel-records.service';
import { TravelRecordsController } from '../../modules/emissions/travel-records/travel-records.controller';


export enum RepositoryMockStrategy {
    sqllitememory,
    jestmock,
}


class CreateTestModuleBuilderParams {
    addController?: boolean;
    repositoryMockStrategy?: RepositoryMockStrategy;
    moduleToUse: string
  }


export function createTestModuleBuilder(
      params: CreateTestModuleBuilderParams
  ): TestingModuleBuilder { 
      let moduleBuilder = createSpecificTestModuleBuilder(params)
      return moduleBuilder.create()
  }


  export async function addMockData(
    params: CreateTestModuleBuilderParams,
    repositoryCompanyMock?: Repository<CompanyEntity>,
    repositoryTravelRecordMock?: Repository<TravelRecordEntity>,
) { 
    let moduleBuilder = createSpecificTestModuleBuilder(params)
    return moduleBuilder.addMockData(repositoryCompanyMock, repositoryTravelRecordMock)
}


abstract class SpecificTestModuleBuilderBase {
    addController: boolean = false;
    moduleToUse: string

    constructor(addController: boolean, moduleToUse: string) {
        this.addController = addController
        this.moduleToUse = moduleToUse
    }

    public abstract create(): TestingModuleBuilder;

    public async addMockData(
        repositoryCompanyMock?: Repository<CompanyEntity>,
        repositoryTravelRecordMock?: Repository<TravelRecordEntity>,
    ) {}
    
}

function createSpecificTestModuleBuilder(
    params: CreateTestModuleBuilderParams
): SpecificTestModuleBuilderBase { 
let moduleBuilder: SpecificTestModuleBuilderBase;
let addController = params.addController || false
let repositoryMockStrategy = (
    params.repositoryMockStrategy || RepositoryMockStrategy.sqllitememory)
  if (repositoryMockStrategy === RepositoryMockStrategy.sqllitememory) {
      moduleBuilder = new TestModuleBuilderSqlLiteInMem(addController, params.moduleToUse);
  }
  else if (repositoryMockStrategy === RepositoryMockStrategy.jestmock) {
      moduleBuilder = new TestModuleBuilderJestMock(addController, params.moduleToUse);
  }
  else {
      throw new Error(`Invalid repositoryMockStrategy: ${params.repositoryMockStrategy}`)
  }
  return moduleBuilder
}

class TestModuleBuilderJestMock extends SpecificTestModuleBuilderBase {

    public create(): TestingModuleBuilder {
        let serviceToUse;
        let controllerToUse;
        if (this.moduleToUse == "emissions") {
            serviceToUse = EmissionsService
            controllerToUse = EmissionsController
        }
        else if (this.moduleToUse == "travel-records") {
            serviceToUse = TravelRecordsService
            controllerToUse = TravelRecordsController
        }

        let moduleMetaData: ModuleMetadata = {
            imports: [],
            providers: [
                serviceToUse,
                { provide: getRepositoryToken(CompanyEntity), useExisting: false}, 
                { provide: getRepositoryToken(TravelRecordEntity), useExisting: false},
            ],
        }
        if (this.addController) {
            moduleMetaData.controllers = [controllerToUse]}
        let moduleBuilder: TestingModuleBuilder = Test.createTestingModule(moduleMetaData)
        moduleBuilder = this.addMockProviders(moduleBuilder);
        return moduleBuilder
    }

    private addMockProviders(
        testingModuleBuilder: TestingModuleBuilder): TestingModuleBuilder {
    
        return (
            testingModuleBuilder
            .overrideProvider(getRepositoryToken(CompanyEntity))
            .useFactory({
                factory: MockFactory.createCompanyRepositoryMock()
            })
            .overrideProvider(getRepositoryToken(TravelRecordEntity))
            .useFactory({
                factory: MockFactory.createTravelRecordRepositoryMock()
            })
        )
    }
}


class TestModuleBuilderSqlLiteInMem extends SpecificTestModuleBuilderBase {

    public create(): TestingModuleBuilder {
        let serviceToUse;
        let controllerToUse;
        if (this.moduleToUse == "emissions") {
            serviceToUse = EmissionsService
            controllerToUse = EmissionsController
        }
        else if (this.moduleToUse == "travel-records") {
            serviceToUse = TravelRecordsService
            controllerToUse = TravelRecordsController
        }
        else {
            throw Error("not implemented")
        }
        let imports = [
            TypeOrmModule.forRoot(databaseCfgForSqlLiteInMemory.getTypeOrmConfig()),
            TypeOrmModule.forFeature([CompanyEntity, TravelRecordEntity]),
            //TravelRecordsModule,
          ]
        let moduleMetaData: ModuleMetadata = {
            imports: imports,
            providers: [serviceToUse,],
        }
        if (this.addController) {
            moduleMetaData.controllers = [controllerToUse]
        }
        let moduleBuilder: TestingModuleBuilder = Test.createTestingModule(moduleMetaData)
        return moduleBuilder
    }


    public override async addMockData(
        repositoryCompanyMock?: Repository<CompanyEntity>,
        repositoryTravelRecordMock?: Repository<TravelRecordEntity>,
    ) {
        if (!repositoryCompanyMock && !repositoryTravelRecordMock) {
            return
        }
        else if (!repositoryCompanyMock ||  !repositoryTravelRecordMock) {
            throw new Error("either not or none is provided")
        }
        else if (repositoryCompanyMock &&  repositoryTravelRecordMock) {
            const companyEntities = (
                MockFactory.createMockCompanies(undefined, repositoryCompanyMock))
            for (const company of companyEntities) {
                // save instead of insert as it will create relations along the way
                // insert updates only specific table
                const trvlRcEntities = (
                    MockFactory.createMockTravelRecords(company, repositoryTravelRecordMock));
                company.travelRecords = trvlRcEntities;
                await repositoryCompanyMock.save(company);
                for (const trvlRcEntity of trvlRcEntities) {
                    // bug in typeorm? acc. to doc save should work for list of items...
                    trvlRcEntity.company = company;
                    await repositoryTravelRecordMock.save(trvlRcEntity);
                }
            }
        }

    }
}
