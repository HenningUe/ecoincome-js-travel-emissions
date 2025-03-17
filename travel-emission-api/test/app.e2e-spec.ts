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

  it('emissions/per-person-in-kg-co2/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/emissions/per-person-in-kg-co2?transportationMode=CarWithRideSharing&origin=hamburg&destination=madrid')
      .expect(200)
      .expect("147.5");
  });
  it('emissions/travel-records/by-distance/ (POST)', async () => {
    return request(app.getHttpServer())
      .post('/emissions/travel-records/by-distance')
      .send({
        company: "newc",
        transportationMode: "Car",
        travelDate: "2025-03-16T16:10:19.075Z",
        distance: 100
      })
      .expect(201)
  });

});
