"use strict";
var typux_1 = require("typux");
var attrs_1 = require("./attrs");
var Binder = (function () {
    function Binder() {
        this.converters = [
            [Number, function (value) { return parseInt(value); }],
            [Boolean, function (value) { return !!value; }]
        ];
    }
    Binder.prototype.bind = function (type, data) {
        var _this = this;
        var info = typux_1.metadata.getClassInfo(type);
        var keys = Object.keys(data);
        var props = info.getProperties();
        var result = new type();
        keys.forEach(function (key) {
            var prop = props.find(function (value, index, obj) { return value.name == key; });
            if (prop && prop.hasAttribute(attrs_1.MODEL_DESIGN)) {
                var design_1 = prop.getAttribute(attrs_1.MODEL_DESIGN);
                if (design_1.length == 1) {
                    result[key] = _this.convert(design_1[0], data[key]);
                }
                else if (design_1[0] === Array) {
                    if (false === Array.isArray(data[key])) {
                        throw new Error('Invalid converting');
                    }
                    result[key] = data[key].map(function (x) { return _this.convert(design_1[1], x); });
                }
            }
            else {
                result[key] = data[key];
            }
        });
        props.forEach(function (prop) {
            if (prop.hasAttribute(attrs_1.MODEL_DEFAULT)) {
                if (false === result.hasOwnProperty(prop.name) || result[prop.name] == null) {
                    result[prop.name] = prop.getAttribute(attrs_1.MODEL_DEFAULT);
                }
            }
        });
        return result;
    };
    Binder.prototype.convert = function (type, value) {
        var converter = this.converters.find(function (x) { return x[0] === type; });
        if (converter) {
            return converter[1].call(null, value);
        }
        return this.bind(type, value);
    };
    return Binder;
}());
exports.Binder = Binder;
