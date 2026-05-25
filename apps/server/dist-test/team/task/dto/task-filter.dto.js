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
exports.TaskFilterDto = void 0;
var class_validator_1 = require("class-validator");
var create_task_dto_1 = require("./create-task.dto");
var TaskFilterDto = /** @class */ (function () {
    function TaskFilterDto() {
    }
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "assignedToId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsEnum)(create_task_dto_1.TaskStatus),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "allapot", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsEnum)(create_task_dto_1.TaskPriority),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "prioritas", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "boardId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "accountId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "opportunityId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "leadId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "quoteId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "orderId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "ticketId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsUUID)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "documentId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        __metadata("design:type", String)
    ], TaskFilterDto.prototype, "search", void 0);
    return TaskFilterDto;
}());
exports.TaskFilterDto = TaskFilterDto;
