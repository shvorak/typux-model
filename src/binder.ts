import {Constructable, metadata} from "typux";
import {MODEL_DEFAULT, MODEL_DESIGN} from "./attrs";

export class Converter
{

    private converters : Array<[Constructable<any>, (value: any) => any]> = [
        [Number, value => parseInt(value)],
        [Boolean, value => !!value]
    ];

    public convertTo<T>(type : Constructable<T>, data : any)
    {
        // TODO : Compare with data.constructor
        if (<Function>type === data.constructor) {
            return data;
        }

        let isList = Array.isArray(data);

        // Scalar type
        let converter = this.converters.find(x => x[0] === type);
        if (converter) {
            return converter[1].call(null, data);
        }

        // Custom type
        let info = metadata.getClassInfo(type);
        if (info == null) {
            throw new Error(`Can't find meta information type ${type}`);
        }

        let props = info.getProperties();
        let propsKeys = props.map(x => x.name as string);

        const convert = (source : any) => {
            let fields = Object.keys(source).concat(propsKeys).filter((v, i, a) => a.indexOf(v) === i);
            let result = new type();

            fields.forEach(name => {

                result[name] = source[name];

                if (propsKeys.indexOf(name) > -1) {
                    let prop = props.find(x => x.name === name);
                    // TODO: Simplify work with attributes
                    if (source[name] == null && prop.hasAttribute(MODEL_DEFAULT)) {
                        result[name] = prop.getAttribute(MODEL_DEFAULT)
                    }
                    if (source[name] != null && prop.hasAttribute(MODEL_DESIGN)) {
                        let design = prop.getAttribute(MODEL_DESIGN);
                        if (design[0] === Array) {
                            console.log(design);

                            if (false === Array.isArray(source[name]))
                                throw new Error('Invalid data passed');
                            result[name] = this.convertTo(design[1], source[name]);
                        } else {
                            result[name] = this.convertTo(design[0], source[name]);
                        }
                    }
                }
            });

            return result;
        };

        return isList
            ? data.map(convert)
            : convert(data);
    }

}