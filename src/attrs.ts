import {Constructable, metadata} from "typux";

export const MODEL_DEFAULT = Symbol('typux.model.default');

export function Default(value) : PropertyDecorator
{
    return (target, propertyKey) => {
        metadata.definePropertyAttribute(target, propertyKey, MODEL_DEFAULT, value);
    }
}

export const MODEL_DESIGN = Symbol('typux.model.design');

export function TypeOf<T>(type : Constructable<T>) : PropertyDecorator
{
    return (target, propertyKey) => {
        metadata.definePropertyAttribute(target, propertyKey, MODEL_DESIGN, [type]);
    }
}

export function ListOf<T>(type : Constructable<T>) : PropertyDecorator
{
    return (target, propertyKey) => {
        metadata.definePropertyAttribute(target, propertyKey, MODEL_DESIGN, [Array, type]);
    }
}