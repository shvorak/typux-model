import {PropertyInfo} from "typux";

export function info(message: string) {
    console.info(message);
}

export function warning(message: string) {
    console.warn(message);
}

export const isEmpty = (v) => v === null || v === undefined;

export const isString = (v) => typeof v === 'string';

export const isObject = (v) => typeof v === 'object' && v != null && false === Array.isArray(v);

export const isFunction = (v) => typeof v === "function";


export const isTyped = (v : PropertyInfo) => v.propertyType != null;
