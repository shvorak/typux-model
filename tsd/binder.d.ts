import { Constructable } from "typux";
export declare class Binder {
    private converters;
    bind<T>(type: Constructable<T>, data: any): T;
    convert<T>(type: Constructable<T>, value: any): T;
}
