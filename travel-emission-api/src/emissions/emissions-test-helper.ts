import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompanyEntity, TravelRecordEntity } from './../entities/travel-emission.entity';
import { MockFactory } from '../entities/travel-emission.entity.mockup';
import { EmissionsController } from './emissions.controller';
import { EmissionsService } from './emissions.service';
import { ModuleMetadata } from '@nestjs/common';


export function createModuleBuilder(addController: boolean): TestingModuleBuilder {
    let moduleMetaData: ModuleMetadata = {
        imports: [],
        providers: [
            EmissionsService,
            { provide: getRepositoryToken(CompanyEntity), useExisting: false}, 
            { provide: getRepositoryToken(TravelRecordEntity), useExisting: false},
        ],
    }
    if (addController) {
        moduleMetaData.controllers = [EmissionsController]}
    let moduleBuilder: TestingModuleBuilder = Test.createTestingModule(moduleMetaData)
    moduleBuilder = addMockProviders(moduleBuilder);
    return moduleBuilder
}


function addMockProviders(
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