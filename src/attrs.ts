import {Attribute, Constructable, reflect} from "typux";
import {ConverterContext} from "./index";

export const ALIAS = Symbol("typux.model.alias");
export const IGNORE = Symbol("typux.model.ignore");

export function Alias(alias: string) : PropertyDecorator {
    return Attribute(ALIAS, alias);
}

export function Ignore() : PropertyDecorator {
    return Attribute(IGNORE);
}

export function Default(value : any) : PropertyDecorator {
    return Attribute(new DefaultAttribute(value));
}

export function DateTime() : PropertyDecorator {
    return Attribute(new DateTimeAttribute());
}

export class ConverterAttribute
{

    public onSerialize(field : string, value : any, context : ConverterContext)
    {

    }

    public onDeserialize(field : string, value : any, context : ConverterContext)
    {

    }

}

export class DefaultAttribute extends ConverterAttribute
{

    private readonly _value: any;

    constructor(value : any) {
        super();
        this._value = value;
    }

    public onDeserialize(field : string, value : any, context : ConverterContext)
    {
        if (value === null || value === undefined)
            return this._value;

        return value;
    }

}

export class DateTimeAttribute extends ConverterAttribute
{

    public onSerialize(field : string, value : any, context : ConverterContext)
    {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    }

    public onDeserialize(field : string, value : any, context : ConverterContext)
    {
        if (value != null) {
            return new Date(value);
        }
        return value;
    }

}