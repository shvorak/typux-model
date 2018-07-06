import * as utils from "./utils";
import {ClassInfo, PropertyInfo, reflect, Func1, Dictionary} from "typux";
import {ConverterAttribute, ALIAS, IGNORE} from "./attrs";


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
        let token = type.token as any;

        if (this.converters.hasOwnProperty(type.token) === false)
            this.converters[token] = new ClassConverter(type);

        let result = this.converters[token]
            .serialize(value, {}, {
                source: value,
                options: this.options,
                converter: this,
            });

        // OPTION: ignoreMissed. Serialize unknown properties
        if (this.options.ignoreMissed !== true)
            // TODO : Implement right behavior
            // this.migrateUnknown(value, result);

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


export class ClassConverter implements ConverterConfig
{

    private readonly type : ClassInfo;

    private readonly props : PropertyInfo[];

    private readonly ignored : PropertyInfo[];

    constructor(type : ClassInfo) {
        this.type = type;

        this.ignored = this.type.getProperties()
            .filter(prop => {
                if (prop.hasAttribute(IGNORE)) {
                    utils.info(`Property ${prop.name.toString()} ignored by attribute Ignore`);
                    return true;
                }
                if (utils.isString(prop.name) === false && prop.hasAttribute(ALIAS) === false) {
                    utils.warning(
                        "We can't serialize and deserialize " +
                        "properties based on Symbol"
                    );
                    return true;
                }

                return false;
            });

        // Filter properties
        this.props = this.type.getProperties()
            .filter(prop => this.ignored.indexOf(prop) >= 0);
    }


    serialize(source : any, target : any, context : ConverterContext) : any {
        const resolver = context.options.propertyResolver;

        this.props.forEach(property => {
            const sourceName = property.name as string;

            if (context.options.ignoreEmpty == true && source[property.name] == null)
                return;

            // TODO : Add guard for is readable

            const targetName = property.hasAttribute(ALIAS)
                ? property.getAttribute(ALIAS)
                : resolver(sourceName);

            const converters = property.getAttributes(ConverterAttribute)
                .map(c => value => c.onSerialize(sourceName, value, context));

            // TODO: Optimize
            if (property.propertyType != null) {
                converters.unshift(value => {
                    if (value == null)
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

        // if (context.options.ignoreMissed !== true)
        //     Object.keys(source)
        //         .filter(name => {
        //
        //         });

        return target;
    }

    deserialize: (source: any, target: any, context: ConverterContext) => any;

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
    ignoreMissed? : boolean;

    // Serialized property name resolver
    propertyResolver : Func1<string | symbol, string>

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
    ignoreMissed: false,
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
