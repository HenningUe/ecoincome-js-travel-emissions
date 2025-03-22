
export class EnumError extends Error {
}


export type EnumAlias = Record<string, string | number>;


/**
 * Converts an enum value to a string.Enum values are contactenated with the separator.
 *
 * @param enumType - The enum type to convert from.
 * @param set - The separator to use. Default is ", ".
 * @returns The string value.
 */
export function getEnumAsString<T extends EnumAlias>(
    enumType: T,
    sep: string=", ",
): string {
    const vals = Object.values(enumType);
    return vals.join(sep);
}

/**
 * Converts a string to the related enum value.
 *
 * @param enumType - The enum type to convert to.
 * @param value - The string value to convert.
 * @returns The enum value.
 */
export function convertString2Enum<T extends EnumAlias>(
    enumType: T,
    value: string
): T[keyof T] {
    if (!(Object.values(enumType) as Array<string | number>).includes(value)) {
        throw new EnumError(`Invalid enum value: ${value}`);
    }
    return value as T[keyof T];
}

/**
 * Converts a value to the related enum value. Value can be either a string or an enum value.
 *
 * @param enumType - The enum type to convert to.
 * @param value - The value to convert.
 * @returns The enum value.
 */
export function convert2Enum<T extends EnumAlias>(
    enumType: T,
    value: T | string,
): T[keyof T] {
    if (typeof value === 'string') {
        return convertString2Enum(enumType, value);
    } else {
        return value.toString() as T[keyof T];
    }
}
