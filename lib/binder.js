"use strict";
var typux_1 = require("typux");
var attrs_1 = require("./attrs");
var Converter = (function () {
    function Converter() {
        this.converters = [
            [Number, function (value) { return parseInt(value); }],
            [Boolean, function (value) { return !!value; }]
        ];
    }
    Converter.prototype.convertTo = function (type, data) {
        var _this = this;
        // TODO : Compare with data.constructor
        if (type === data.constructor) {
            return data;
        }
        var isList = Array.isArray(data);
        // Scalar type
        var converter = this.converters.find(function (x) { return x[0] === type; });
        if (converter) {
            return converter[1].call(null, data);
        }
        // Custom type
        var info = typux_1.metadata.getClassInfo(type);
        if (info == null) {
            throw new Error("Can't find meta information type " + type);
        }
        var props = info.getProperties();
        var propsKeys = props.map(function (x) { return x.name; });
        var convert = function (source) {
            var fields = Object.keys(source).concat(propsKeys).filter(function (v, i, a) { return a.indexOf(v) === i; });
            var result = new type();
            fields.forEach(function (name) {
                result[name] = source[name];
                if (propsKeys.indexOf(name) > -1) {
                    var prop = props.find(function (x) { return x.name === name; });
                    // TODO: Simplify work with attributes
                    if (source[name] == null && prop.hasAttribute(attrs_1.MODEL_DEFAULT)) {
                        result[name] = prop.getAttribute(attrs_1.MODEL_DEFAULT);
                    }
                    if (source[name] != null && prop.hasAttribute(attrs_1.MODEL_DESIGN)) {
                        var design = prop.getAttribute(attrs_1.MODEL_DESIGN);
                        if (design[0] === Array) {
                            console.log(design);
                            if (false === Array.isArray(source[name]))
                                throw new Error('Invalid data passed');
                            result[name] = _this.convertTo(design[1], source[name]);
                        }
                        else {
                            result[name] = _this.convertTo(design[0], source[name]);
                        }
                    }
                }
            });
            return result;
        };
        return isList
            ? data.map(convert)
            : convert(data);
    };
    return Converter;
}());
exports.Converter = Converter;
