import {Constructable, metadata} from "typux";
import {MODEL_DEFAULT, MODEL_DESIGN} from "./attrs";

export class Binder
{

    private converters : Array<[Constructable<any>, (value: any) => any]> = [
        [Number, value => parseInt(value)],
        [Boolean, value => !!value]
    ];

    public bind<T>(type : Constructable<T>, data : any)
    {
        let info = metadata.getClassInfo(type);
        let keys = Object.keys(data);

        let props = info.getProperties();

        const result = new type();

        keys.forEach(key => {
            let prop = props.find((value, index, obj) => value.name == key);
            if (prop && prop.hasAttribute(MODEL_DESIGN)) {
                let design = prop.getAttribute(MODEL_DESIGN);
                if (design.length == 1) {
                    result[key] = this.convert(design[0], data[key]);
                } else if (design[0] === Array) {
                    if (false === Array.isArray(data[key])) {
                        throw new Error('Invalid converting');
                    }
                    result[key] = data[key].map(x => this.convert(design[1], x))
                }
            } else {
                result[key] = data[key];
            }
        });

        props.forEach(prop => {
           if (prop.hasAttribute(MODEL_DEFAULT)) {
               if (false === result.hasOwnProperty(prop.name) || result[prop.name] == null) {
                   result[prop.name] = prop.getAttribute(MODEL_DEFAULT);
               }
           }
        });

        return result;
    }

    public convert<T>(type : Constructable<T>, value : any) : T
    {
        let converter = this.converters.find(x => x[0] === type);
        if (converter) {
            return converter[1].call(null, value);
        }
        return this.bind(type, value);
    }

}