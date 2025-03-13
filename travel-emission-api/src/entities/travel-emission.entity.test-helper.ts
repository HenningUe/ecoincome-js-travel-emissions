
import { TransportationMode } from '@app/travel-emission-calc';
import { CompanyEntity, TravelRecordEntity } from './travel-emission.entity';


export class MockFactory {  

  static createTravelRecordRepositoryMock() {
    const entities = MockFactory.createMockTravelRecords();
    let factory = MockFactory.createRepositoryMock(entities);
    return factory
  }

  static createCompanyRepositoryMock() {
    const entities = MockFactory.createMockCompanies();
    let factory = MockFactory.createRepositoryMock(entities);
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
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn(() => ({
          andWhere: jest.fn(() => ({
            getMany: jest.fn(() => Promise.resolve([])),
          })),
        })),
      })),
    })
    return factory
  }

  protected static createMockTravelRecords(
    attachCompany: boolean = false,
    number_weeks: number = 20,
  )  {
    let travelRcs: TravelRecordEntity[] = [];
    let company = MockFactory.createMockCompanies()[0];
    for (let monday of MockFactory.mondayIterator(number_weeks)) {
      let travelRc = new TravelRecordEntity();
      if (attachCompany) {
        travelRc.company = company;      
      }
      travelRc.distanceKm = 100;
      travelRc.emissionCO2 = 100;
      travelRc.transportationMode = TransportationMode.Car;
      travelRc.travelDate = monday;
      travelRc.origin = "origin";
      travelRc.destination = "destination";
      travelRcs.push(travelRc);
  }

    return travelRcs
  }

  static createMockCompanies(attachTravelRecords: boolean = false) {
    let company1 = new CompanyEntity("ecoincome");
    let company2 = new CompanyEntity("dimond");
    if (attachTravelRecords) {
      company1.travelRecords = MockFactory.createMockTravelRecords(false);
      company2.travelRecords = MockFactory.createMockTravelRecords(false);
    }
    return [company1, company2]
  }

  protected static* mondayIterator(weeks: number): Generator<Date> {
    let nextMonday = new Date(2024, 6, 3);
    for (let i = 0; i < weeks; i++) {
        yield new Date(nextMonday);
        nextMonday.setDate(nextMonday.getDate() + 7);
    }
}
}