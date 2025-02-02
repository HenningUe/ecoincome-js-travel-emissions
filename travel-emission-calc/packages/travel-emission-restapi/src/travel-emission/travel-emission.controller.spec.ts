import { Test, TestingModule } from '@nestjs/testing';
import { TravelEmissionController } from './travel-emission.controller';
import { TravelEmissionService } from './travel-emission.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('TravelEmissionController', () => {
  let controller: TravelEmissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelEmissionController],
    }).compile();

    controller = module.get<TravelEmissionController>(TravelEmissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
