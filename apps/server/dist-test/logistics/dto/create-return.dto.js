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
exports.CreateReturnDto = exports.ReturnOk = void 0;
var class_validator_1 = require("class-validator");
var ReturnOk;
(function (ReturnOk) {
    ReturnOk["HIBAS"] = "hibas";
    ReturnOk["SERTETT"] = "sertett";
    ReturnOk["TULCSORDULAS"] = "tulcsordulas";
    ReturnOk["EGYEB"] = "egyeb";
})(ReturnOk || (exports.ReturnOk = ReturnOk = {}));
var CreateReturnDto = /** @class */ (function () {
    function CreateReturnDto() {
    }
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], CreateReturnDto.prototype, "orderId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], CreateReturnDto.prototype, "purchaseOrderId", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], CreateReturnDto.prototype, "itemId", void 0);
    __decorate([
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], CreateReturnDto.prototype, "warehouseId", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.Min)(0.01),
        __metadata("design:type", Number)
    ], CreateReturnDto.prototype, "mennyiseg", void 0);
    __decorate([
        (0, class_validator_1.IsEnum)(ReturnOk),
        __metadata("design:type", String)
    ], CreateReturnDto.prototype, "ok", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsDateString)(),
        __metadata("design:type", String)
    ], CreateReturnDto.prototype, "visszaruDatum", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], CreateReturnDto.prototype, "megjegyzesek", void 0);
    return CreateReturnDto;
}());
exports.CreateReturnDto = CreateReturnDto;
