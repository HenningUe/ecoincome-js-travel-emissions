import {getEmissionCO2KgTotalPerPerson} from './index';
//import {describe, it, expect} from 'vitest';

describe('TravelEmissionCalcService', () => {

  it('should be getCO2EmissionKgTotalPerPerson', async () => {
    const emission = await getEmissionCO2KgTotalPerPerson("Car", "Munich", "Berlin");
    expect(emission).toBe(99.3);
  });
});
