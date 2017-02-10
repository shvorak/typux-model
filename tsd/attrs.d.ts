import { Constructable } from "typux";
export declare const MODEL_DEFAULT: symbol;
export declare function Default(value: any): PropertyDecorator;
export declare const MODEL_DESIGN: symbol;
export declare function TypeOf<T>(type: Constructable<T>): PropertyDecorator;
export declare function ListOf<T>(type: Constructable<T>): PropertyDecorator;
