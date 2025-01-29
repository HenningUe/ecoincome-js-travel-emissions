
import { describe, it, expect } from 'vitest';
import { getDistanceAsKm } from '../src/index.ts';

describe('getDistanceAsKm check', () => {
  it('should return the correct distance', () => {
    expect(getDistanceAsKm("key", "Car", "Berlin", "Munich")).toBe(10);
  });
});
