import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
//import * as request from 'supertest';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
//import { describe, it, expect, beforeEach } from 'vitest';

import './_test-common'

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/travel-emission/getCO2EmissionKgTotalPerPerson/?TransportationMode=Car&origin=munich&destination=paris')
      .expect(200)
      .expect("143.1");
  });
  
});
