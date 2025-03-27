import "./../src/instrument";

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { addAppConfig } from './../src/main.config';


describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    addAppConfig(app);
    await app.init();
  });

  afterAll(async () => {
    //await connection.destroy();
    await app.close(); //
  });

  it('api/v0/emissions/invalid-url/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/v0/emissions/invalid-url')
      .expect(404)
      .then(response => {
        const isIn = response.text.includes("API path not found. Please checkout the API documentation");
        expect(isIn).toBe(true);
      });
  }, 10000);

  it('emissions/debug-error-test/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/v0/emissions/debug-error-test')
      .expect(500)
      .then(response => {
        const isIn = response.text.includes("Internal server error. Error was reported to the development team");
        expect(isIn).toBe(true);
      });
  }, 10000);

  it('emissions/per-person-in-kg-co2/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/v0/emissions/per-person-in-kg-co2?transportationMode=CarWithRideSharing&origin=hamburg&destination=madrid')
      .expect(200)
      .then(response => {
        const value = parseFloat(response.text);
        expect(value).toBeCloseTo(147.5, 0);
      });
  }, 1000000);

  it('emissions/travel-records/by-distance/ (POST)', async () => {
    return request(app.getHttpServer())
      .post('/api/v0/emissions/travel-records/by-distance')
      .send({
        company: "newc",
        transportationMode: "Car",
        travelDate: "2025-03-16T16:10:19.075Z",
        distance: 100
      })
      .expect(201)
  });

  it('emissions/travel-records/by-distance/ (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/v0/emissions/travel-records/debug-by-distance-as-get?company=newc&transportationMode=Car&travelDate=2025-01-02&distance=200')
      .expect(200)
  }, 1000000);

});
