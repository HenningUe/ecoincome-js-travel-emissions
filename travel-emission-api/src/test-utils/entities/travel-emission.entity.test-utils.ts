
import { TransportationMode } from '@app/travel-emission-calc';
import { CompanyEntity, TravelRecordEntity } from '../../entities/travel-emission.entity';



export class MockFactory {  

  static createTravelRecordRepositoryMock() {    
    let company = MockFactory.createMockCompanies()[0];
    const entities = MockFactory.createMockTravelRecords(company);
    let factory = MockFactory.createRepositoryMock(entities);
    return factory
  }

  static createCompanyRepositoryMock() {
    let companies = MockFactory.createMockCompanies();
    let entities: TravelRecordEntity[] = [];
    companies.forEach(company => {
      const x = MockFactory.createMockTravelRecords(company);
      entities = entities.concat(x);      
    });
    let factory = MockFactory.createRepositoryMock(entities);
    return factory
  }

  static createRepositoryMock(entities: any[]) {
    let factory = () => ({
      entities: entities,
      create: jest.fn(() => new Promise((resolve) => resolve(entities[0]))),
      find: jest.fn(() => new Promise((resolve) => resolve(entities))),
      findOne: jest.fn(
          ({ name }) =>
              new Promise((resolve) => {
                  resolve(entities[0]);  //.findLast(x => x.name === name));
              }),
      ),
      createQueryBuilder: jest.fn(() => ({
        addSelect: jest.fn(() => ({
          leftJoinAndSelect: jest.fn(() => ({
            where: jest.fn(() => ({
              groupBy: jest.fn(() => ({
                orderBy: jest.fn(() => ({
                  getRawMany: jest.fn(() => Promise.resolve([])),
                })),
              })),
            })),
          })),
        })),
      })),
    })
    return factory
  }

  public static createMockTravelRecordsRaw(
    numberWeeks: number = 20,
  ): any[] {
    let travelRcs: any[] = [];
    for (let dayDate of MockFactory.dayIterator(numberWeeks)) {
      let travelRc = {
        company: undefined,
        distanceKm: 100,
        emissionCO2: 100,
        transportationMode: TransportationMode.Car,
        travelDate: dayDate,
        origin: "origin",
        destination: "destination"
      };
      travelRcs.push(travelRc);
    }
    return travelRcs
  }

  public static createMockTravelRecords(
    companyToAttach?: CompanyEntity,
    numberWeeks: number = 20,
  ): TravelRecordEntity[] {
    let travelRcs: TravelRecordEntity[] = [];
    for (let dayDate of MockFactory.dayIterator(numberWeeks)) {
      let travelRc = new TravelRecordEntity();
      if (companyToAttach) {
        travelRc.company = companyToAttach;      
      }
      travelRc.distanceKm = 100;
      travelRc.emissionCO2 = 100;
      travelRc.transportationMode = TransportationMode.Car;
      travelRc.travelDate = dayDate;
      travelRc.origin = "origin";
      travelRc.destination = "destination";
      travelRcs.push(travelRc);
    }
    return travelRcs
  }

  public static createMockCompaniesRaw(): any[] {
    let company1 = {name: "ecoincome"};
    let company2 = {name: "dimond"};

    return [company1, company2]
  }

  public static createMockCompanies(
    travelRecordsToAttach?: TravelRecordEntity[],
  ): CompanyEntity[] {
    let company1 = new CompanyEntity("ecoincome");
    let company2 = new CompanyEntity("dimond");
    if (travelRecordsToAttach) {
      company1.travelRecords = travelRecordsToAttach;
      company2.travelRecords = travelRecordsToAttach;
    }
    return [company1, company2]
  }

  protected static* dayIterator(weeks: number): Generator<Date> {
    let nextDay = new Date(2024, 6, 3);
    for (let i = 0; i < weeks; i++) {
        yield new Date(nextDay);
        nextDay.setDate(nextDay.getDate() + 3);
        yield new Date(nextDay);
        nextDay.setDate(nextDay.getDate() + 4);
    }
}
}