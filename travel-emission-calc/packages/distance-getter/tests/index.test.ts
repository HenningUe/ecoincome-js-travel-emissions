
import { describe, it, expect } from 'vitest';
import { getDistance } from '../src/index.js';

describe('sum function', () => {
  it('should return the correct distance', () => {
    expect(getDistance("aa", "bb")).toBe(10);
  });
});