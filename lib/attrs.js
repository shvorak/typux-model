"use strict";
var typux_1 = require("typux");
exports.MODEL_DEFAULT = Symbol('typux.model.default');
function Default(value) {
    return function (target, propertyKey) {
        typux_1.metadata.definePropertyAttribute(target, propertyKey, exports.MODEL_DEFAULT, value);
    };
}
exports.Default = Default;
exports.MODEL_DESIGN = Symbol('typux.model.design');
function TypeOf(type) {
    return function (target, propertyKey) {
        typux_1.metadata.definePropertyAttribute(target, propertyKey, exports.MODEL_DESIGN, [type]);
    };
}
exports.TypeOf = TypeOf;
function ListOf(type) {
    return function (target, propertyKey) {
        typux_1.metadata.definePropertyAttribute(target, propertyKey, exports.MODEL_DESIGN, [Array, type]);
    };
}
exports.ListOf = ListOf;
