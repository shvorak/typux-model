import * as utils from "./utils";
import {reflect} from "typux";
import {ConverterAttribute, ALIAS, IGNORE} from "./attrs";


export class Converter
{

    private readonly _options: ConverterOptions;

    constructor(options : ConverterOptions) {
        this._options = options;
    }

    public serialize(value : object) : any
    {
        if (false === utils.isObject(value))
            throw new Error("Value must be object and can't be null or array");

        const type = reflect.getClassInfo(value);
        const result = {};
        const context = new ConverterContext(value, this);
        const resolver = this._options.propertyResolver;
        const properties = type.getProperties();

        properties.forEach(property => {

            if (property.hasAttribute(IGNORE))
                return utils.info(`Property ${property.name} ignored by attribute Ignore`);

            const sourceName = property.name;

            if (false === utils.isString(sourceName) && false === property.hasAttribute(ALIAS))
                return utils.warning(
                    "We can't serialize and deserialize " +
                    "properties based on Symbol"
                );

            const attributes = property.getAttributes(ConverterAttribute);

            const targetName = property.hasAttribute(ALIAS)
                ? property.getAttribute(ALIAS)
                : resolver.getPropertyName(sourceName as string);

            let sourceValue = value[property.name];

            if (property.propertyType != null && false === utils.isEmpty(sourceValue)) {
                sourceValue = property.propertyType.isList
                    ? this.serializeCollection(sourceValue)
                    : this.serialize(sourceValue)
            }

            const targetValue = attributes.reduce<any>((value, converter) => {
                return converter.onSerialize(sourceName as string, value, context);
            }, sourceValue);

            // OPTION: ignoreEmpty. Ignore properties with undefined
            if (targetValue === undefined && this._options.ignoreEmpty === true)
                return;

            result[targetName] = targetValue;
        });

        // OPTION: ignoreUnknown. Serialize unknown properties
        if (this._options.ignoreUnknown !== true)
            Object.keys(value)
                .filter(key => properties.every(x => x.name !== key) && false === result.hasOwnProperty(key))
                .forEach(key => result[resolver.getPropertyName(key)] = value[key]);

        return result;
    }

    public serializeCollection(items : any[]) : any[]
    {
        return items.map(x => this.serialize(x));
    }

}


export class ConverterContext
{

    public readonly source: any;

    public readonly converter: Converter;

    constructor(source: any, converter : Converter) {
        this.source = source;
        this.converter = converter;
    }

}

export interface ConverterOptions {

    // If true converter not include undefined values. default false
    ignoreEmpty? : boolean;

    // If true converter will be skip properties without metadata. default false
    ignoreUnknown? : boolean;

    // Serialized property name resolver
    propertyResolver : PropertyResolver

}

export class PropertyResolver
{

    getPropertyName(property : string) : string {
        return property;
    }

}

/**
 * Contains default converter options
 *
 * Example: Make own options
 *
 * ```js
 * import {Converter, defaultOptions} from 'typux-model';
 *
 * const myOptions = {...defaultOptions,
 *     ignoreEmpty: false
 * }
 *
 * const myConverter = new Converter(myOptions);
 * ```
 *
 * @type {ConverterOptions}
 */
export const defaultOptions = {
    ignoreEmpty: true,
    propertyResolver: new PropertyResolver()
};

/**
 * Default Converter instance
 * @type {Converter}
 */
export const converter = new Converter(defaultOptions);

/**
 * Export all attributes
 */
export * from './attrs';
