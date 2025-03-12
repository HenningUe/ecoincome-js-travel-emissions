import {getEnumAsString, convert2Enum, convertStringToEnum, EnumError} from './index';
//import {describe, it, expect} from 'vitest';

enum TestEnum {
  Car = 'Car',
  Bike = 'Bike',
  Walk = 'Walk',
}


describe('EnumConversion', () => {

  it('getEnumAsString', () => {
    const asStr = getEnumAsString(TestEnum, ", ");
    expect(asStr).toBe("Car, Bike, Walk");
  });

  it('convertStringToEnum', () => {
    const asEnum = convertStringToEnum(TestEnum, "Bike");
    expect(asEnum).toBe(TestEnum.Bike);
  });

  it('convertStringToEnumInvalid', () => {
    expect(() => {convertStringToEnum(TestEnum, "Lift")}).toThrow(EnumError);
  });

  it('convert2Enum', () => {
    const asEnum = convert2Enum(TestEnum, "Bike");
    expect(asEnum).toBe(TestEnum.Bike);
  });

  it('convert2Enum', () => {
    const asEnum = convert2Enum(TestEnum, TestEnum.Bike);
    expect(asEnum).toBe(TestEnum.Bike);
  });
});
