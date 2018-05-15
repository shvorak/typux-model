import * as utils from "./utils";
import {Constructable, ClassInfo, PropertyInfo, reflect, Func0, Func1, Dictionary} from "typux";
import {ConverterAttribute, ALIAS, IGNORE} from "./attrs";


function createConverterFor(type: ClassInfo) : ConverterConfig  {


    const members = type.getProperties()
        .map(property => {

        });


    return {
        serialize : (source, target, context) => null,
        deserialize: (source, target, context) => null,
    }
}

export class Converter
{

    public readonly options: ConverterOptions;

    private readonly converters : Dictionary<ConverterConfig> = {};

    constructor(options : ConverterOptions) {
        this.options = options;
    }

    public serialize(value : object) : any
    {
        if (false === utils.isObject(value))
            throw new Error("Value must be object and can't be null or array");

        let type = reflect.getClassInfo(value);
        if (this.converters.hasOwnProperty(type.token) === false)
            this.converters[type.token] = createConverterFor(type);

        let result = this.converters[type.token]
            .serialize(value, {}, {
                source: value,
                options: this.options,
                converter: this,
            });

        // OPTION: ignoreUnknown. Serialize unknown properties
        if (this.options.ignoreUnknown !== true)
            this.migrateUnknown(value, result);

        return result;
    }

    public serializeCollection(items : any[]) : any[]
    {
        return items.map(x => this.serialize(x));
    }

    /**
     * Migrate non existing in ClassInfo properties to target object
     *
     * @param source
     * @param target
     */
    private migrateUnknown(source : any, target : any)
    {
        Object.keys(source)
            .map(key => {
                return {
                    original: key,
                    converted: this.options.propertyResolver(key)
                }
            })
            .filter(x => false === target.hasOwnProperty(x.converted))
            .forEach(x => target[x.converted] = source[x.original]);
    }

}


export class ClassConverter
{

    private readonly type : ClassInfo;

    private readonly props : PropertyInfo[];

    constructor(type : ClassInfo) {
        this.type = type;

        // Filter properties
        this.props = this.type.getProperties()
            .filter(prop => {
                if (prop.hasAttribute(IGNORE)) {
                    utils.info(`Property ${prop.name} ignored by attribute Ignore`);
                    return false;
                }
                if (utils.isString(prop.name) === false && prop.hasAttribute(ALIAS) === false) {
                    utils.warning(
                        "We can't serialize and deserialize " +
                        "properties based on Symbol"
                    );
                    return false;
                }

                return true;
            });
    }


    serialize(source : any, target : any, context : ConverterContext) : any {
        const resolver = context.options.propertyResolver;

        this.props.forEach(property => {
            const sourceName = property.name as string;

            const targetName = property.hasAttribute(ALIAS)
                ? property.getAttribute(ALIAS)
                : resolver(sourceName as string);

            const converters = property.getAttributes(ConverterAttribute)
                .map(c => value => c.onSerialize(sourceName, value, context));

            // TODO: Optimize
            if (property.propertyType != null) {
                converters.unshift(value => {
                    if (value === undefined)
                        return value;

                    return property.propertyType.isList
                        ? context.converter.serializeCollection(value)
                        : context.converter.serialize(value)
                });
            }
            const sourceValue = source[property.name];
            const targetValue = converters
                .reduce((value, converter) => converter(value), sourceValue);

            if (targetValue !== undefined || context.options.ignoreEmpty === true)
                target[targetName] = targetValue
        });

        return target;
    }

}


export interface ConverterContext
{

    readonly source: any;

    readonly target?: any;

    readonly options: ConverterOptions;

    readonly converter: Converter;

}

export interface ConverterConfig {

    serialize : (source : any, target : any, context : ConverterContext) => any

    deserialize : (source : any, target : any, context : ConverterContext) => any

}

export interface ConverterOptions {

    // If true converter not include undefined values. default false
    ignoreEmpty? : boolean;

    // If true converter will be skip properties without metadata. default false
    ignoreUnknown? : boolean;

    // Serialized property name resolver
    propertyResolver : Func1<string, string>

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
    propertyResolver: (name : string) => name
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
