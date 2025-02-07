import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';


describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    //await connection.destroy();
    await app.close(); //
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/getCO2EmissionKgTotalPerPerson?transportationMode=Car&origin=munich&destination=paris')
      .expect(200)
      .expect("143.2");
  });

  
  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/addTravelRecordAsGet?company=BMW&transportationMode=Car&origin=munich&destination=paris')
  //     .expect(200)
  //     .expect("OK");
  // });
});
