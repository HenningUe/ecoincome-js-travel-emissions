
import { test, describe, it, expect, beforeAll, vi } from 'vitest';
import { getDistanceKm, getCO2EmissionKgTotalPerPerson } from '../src/index';

const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_MAPS_API_KEY: string = <string>process.env.GOOGLE_MAPS_API_KEY;

describe('getDistanceAsKm check', () => {

  test('async', async () => {
    const dist = await getDistanceKm(GOOGLE_MAPS_API_KEY, "Car", "Berlin", "Munich");
    expect(dist).toEqual(585);
  }, 100000);

  it('async', async () => {
    const emission = await getCO2EmissionKgTotalPerPerson(GOOGLE_MAPS_API_KEY, "Car", "Berlin", "Munich");
    expect(emission).toBe(99.45);
  }, 100000);
});
