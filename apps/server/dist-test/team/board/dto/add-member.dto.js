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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMemberDto = exports.BoardMemberPermission = void 0;
var class_validator_1 = require("class-validator");
var BoardMemberPermission;
(function (BoardMemberPermission) {
    BoardMemberPermission["VIEW"] = "VIEW";
    BoardMemberPermission["EDIT"] = "EDIT";
    BoardMemberPermission["ADMIN"] = "ADMIN";
})(BoardMemberPermission || (exports.BoardMemberPermission = BoardMemberPermission = {}));
var AddMemberDto = /** @class */ (function () {
    function AddMemberDto() {
    }
    __decorate([
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], AddMemberDto.prototype, "userId", void 0);
    __decorate([
        (0, class_validator_1.IsEnum)(BoardMemberPermission),
        __metadata("design:type", String)
    ], AddMemberDto.prototype, "jogosultsag", void 0);
    return AddMemberDto;
}());
exports.AddMemberDto = AddMemberDto;
