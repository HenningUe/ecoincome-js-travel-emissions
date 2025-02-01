import { Test, TestingModule } from '@nestjs/testing';
import { TravelEmissionService } from './travel-emission.service';

describe('TravelEmissionService', () => {
  let service: TravelEmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TravelEmissionService],
    }).compile();

    service = module.get<TravelEmissionService>(TravelEmissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
