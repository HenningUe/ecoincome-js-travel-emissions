import {getEmissionCO2KgTotalPerPerson} from './index';
//import {describe, it, expect} from 'vitest';

describe('TravelEmissionCalcService', () => {

  it('should be getCO2EmissionKgTotalPerPerson', async () => {
    const returnData = await getEmissionCO2KgTotalPerPerson("Car", "Munich", "Berlin");
    expect(returnData.emissionCO2).toBe(99.3);
  });
});
