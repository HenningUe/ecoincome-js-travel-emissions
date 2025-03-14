import { Test, TestingModuleBuilder, } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { databaseCfgForSqlLiteInMemory } from '../../config/database/in-memory-database.config';
import { CompanyEntity, TravelRecordEntity } from '../../entities/travel-emission.entity';
import { MockFactory } from '../entities/travel-emission.entity.test-utils';
import { EmissionsController } from '../../emissions/emissions.controller';
import { EmissionsService } from '../../emissions/emissions.service';
import { ModuleMetadata } from '@nestjs/common';
import { Repository } from 'typeorm';


export enum RepositoryMockStrategy {
    sqllitememory,
    jestmock,
}


class CreateTestModuleBuilderParams {
    addController?: boolean;
    repositoryMockStrategy?: RepositoryMockStrategy;
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

    constructor(addController: boolean) {
        this.addController = addController
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
      moduleBuilder = new TestModuleBuilderSqlLiteInMem(addController);
  }
  else if (repositoryMockStrategy === RepositoryMockStrategy.jestmock) {
      moduleBuilder = new TestModuleBuilderJestMock(addController);
  }
  else {
      throw new Error(`Invalid repositoryMockStrategy: ${params.repositoryMockStrategy}`)
  }
  return moduleBuilder
}

class TestModuleBuilderJestMock extends SpecificTestModuleBuilderBase {

    public create(): TestingModuleBuilder {
        let moduleMetaData: ModuleMetadata = {
            imports: [],
            providers: [
                EmissionsService,
                { provide: getRepositoryToken(CompanyEntity), useExisting: false}, 
                { provide: getRepositoryToken(TravelRecordEntity), useExisting: false},
            ],
        }
        if (this.addController) {
            moduleMetaData.controllers = [EmissionsController]}
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
        let imports = [
            TypeOrmModule.forRoot(databaseCfgForSqlLiteInMemory.getTypeOrmConfig()),
            TypeOrmModule.forFeature([CompanyEntity, TravelRecordEntity]),
            //TravelRecordsModule,
          ]
        let moduleMetaData: ModuleMetadata = {
            imports: imports,
            providers: [EmissionsService,],
        }
        if (this.addController) {
            moduleMetaData.controllers = [EmissionsController]
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
        else if (!repositoryCompanyMock ||  !repositoryCompanyMock) {
            throw new Error("either not or none is provided")
        }
        else if (repositoryCompanyMock &&  repositoryTravelRecordMock) {
            const companyEntities = MockFactory.createMockCompanies();
            companyEntities.forEach(company => {
                const trvlRcEntities = MockFactory.createMockTravelRecordsRaw()
                company.travelRecords = trvlRcEntities;
                // save instead of insert as it will create relations along the way
                // insert updates only specific table
                let company2 = repositoryCompanyMock.create(company);
                repositoryCompanyMock.save(company2);
                trvlRcEntities.forEach(trvlRcEntity => {
                    // bug in typeorm? acc. to doc save should work for list of items...
                    trvlRcEntity = repositoryTravelRecordMock.create(trvlRcEntity);
                    repositoryTravelRecordMock.save(trvlRcEntity);
                });
            });
            let results = await repositoryTravelRecordMock.find();
            console.log(results);
            let results2 = await repositoryCompanyMock.find();
            console.log(results2);
        }

    }
}
