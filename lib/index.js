"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var attrs_1 = require("./attrs");
var binder_1 = require("./binder");
__export(require("./attrs"));
__export(require("./binder"));
var Comment = (function () {
    function Comment() {
    }
    return Comment;
}());
__decorate([
    attrs_1.TypeOf(Number),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    attrs_1.Default('Empty'),
    __metadata("design:type", String)
], Comment.prototype, "text", void 0);
var Profile = (function () {
    function Profile() {
    }
    return Profile;
}());
__decorate([
    attrs_1.TypeOf(Number),
    __metadata("design:type", Number)
], Profile.prototype, "id", void 0);
__decorate([
    attrs_1.TypeOf(Boolean),
    __metadata("design:type", Boolean)
], Profile.prototype, "deleted", void 0);
__decorate([
    attrs_1.ListOf(Comment),
    __metadata("design:type", Array)
], Profile.prototype, "comments", void 0);
var binder = new binder_1.Binder();
var profile = binder.bind(Profile, {
    id: '1',
    deleted: 0,
    comments: [
        {
            'id': '2'
        }
    ]
});
console.log(profile);
