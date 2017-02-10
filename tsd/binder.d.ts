import { Constructable } from "typux";
export declare class Converter {
    private converters;
    convertTo<T>(type: Constructable<T>, data: any): any;
}
