import {getCO2EmissionKgTotalPerPerson} from './index';
//import {describe, it, expect} from 'vitest';

describe('TravelEmissionCalcService', () => {

  it('should be getCO2EmissionKgTotalPerPerson', async () => {
    const emission = await getCO2EmissionKgTotalPerPerson("Car", "Munich", "Berlin");
    expect(emission).toBe(99.3);
  });
});
