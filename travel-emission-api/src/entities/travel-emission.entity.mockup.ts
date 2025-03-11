
import { TransportationMode } from '@app/travel-emission-calc';
import { CompanyEntity, TravelRecordEntity } from './travel-emission.entity';


export class MockFactory {  

  static createTravelRecordRepositoryMock() {
    const entity = MockFactory.createMockTravelRecord();
    let factory = MockFactory.createRepositoryMock([entity]);
    return factory
  }

  static createCompanyRepositoryMock() {
    const entity = MockFactory.createMockCompany();
    let factory = MockFactory.createRepositoryMock([entity]);
    return factory
  }

  static createRepositoryMock(entities: any[]) {
    let factory = () => ({
      create: jest.fn(() => new Promise((resolve) => resolve(entities[0]))),
      find: jest.fn(() => new Promise((resolve) => resolve(entities))),
      findOne: jest.fn(
          ({ name }) =>
              new Promise((resolve) => {
                  resolve(entities[0]);
              }),
      ),
    })
    return factory
  }

  protected static createMockTravelRecord(attachCompany: boolean = false)  {
    let travelRc = new TravelRecordEntity();
    if (attachCompany) {
      travelRc.company = MockFactory.createMockCompany();      
    }
    travelRc.distanceKm = 100;
    travelRc.emissionCO2 = 100;
    travelRc.transportationMode = TransportationMode.Car;
    travelRc.travelDate = new Date();
    travelRc.origin = "origin";
    travelRc.destination = "destination";
    return travelRc
  }

  static createMockCompany(attachTravelRecords: boolean = false) {
    let company = new CompanyEntity();
    company.name = "BMW";
    if (attachTravelRecords) {
      company.travelRecords = [MockFactory.createMockTravelRecord(false)];
    }
    return company
  }
}