
export class EnumError extends Error {
}


export type EnumAlias = Record<string, string | number>;


export function getEnumAsString<T extends EnumAlias>(
    enumType: T,
    sep: string=", ",
): string {
    const vals = Object.values(enumType);
    return vals.join(sep);
}


export function convertString2Enum<T extends EnumAlias>(
    enumType: T,
    value: string
): T[keyof T] {
    if (!(Object.values(enumType) as Array<string | number>).includes(value)) {
        throw new EnumError(`Invalid enum value: ${value}`);
    }
    return value as T[keyof T];
}

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
