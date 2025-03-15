import { Test, TestingModule } from '@nestjs/testing';
import { TravelRecordsService } from './travel-records.service';

describe('TravelRecordsService', () => {
  let service: TravelRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelRecordsService],
    }).compile();

    service = module.get<TravelRecordsService>(TravelRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
