
import { test, describe, it, expect, beforeAll, vi } from 'vitest';
import { getDistanceAsKm, getAsyncDistanceAsKm } from '../src/index';

const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_MAPS_API_KEY: string = <string>process.env.GOOGLE_MAPS_API_KEY;

describe('getDistanceAsKm check', () => {

  test('async', async () => {
    const dist = await getAsyncDistanceAsKm(GOOGLE_MAPS_API_KEY, "Car", "Berlin", "Munich");
    expect(dist).toEqual(585);
  }, 100000);

  it('non async', () => {
    expect(getDistanceAsKm(GOOGLE_MAPS_API_KEY, "Car", "Berlin", "Munich")).toBe(10);
  });
});
