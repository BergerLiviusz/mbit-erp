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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
var common_1 = require("@nestjs/common");
var employee_service_1 = require("./employee.service");
var rbac_decorator_1 = require("../common/rbac/rbac.decorator");
var permission_enum_1 = require("../common/rbac/permission.enum");
var rbac_guard_1 = require("../common/rbac/rbac.guard");
var audit_service_1 = require("../common/audit/audit.service");
var EmployeeController = /** @class */ (function () {
    function EmployeeController(employeeService, auditService) {
        this.employeeService = employeeService;
        this.auditService = auditService;
    }
    EmployeeController.prototype.findAll = function (skip, take, jobPositionId, osztaly, reszleg, aktiv, search) {
        return this.employeeService.findAll(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, {
            jobPositionId: jobPositionId,
            osztaly: osztaly,
            reszleg: reszleg,
            aktiv: aktiv === 'true' ? true : aktiv === 'false' ? false : undefined,
            search: search,
        });
    };
    EmployeeController.prototype.findOne = function (id) {
        return this.employeeService.findOne(id);
    };
    EmployeeController.prototype.addPreviousEmployment = function (id, body) {
        return this.employeeService.createPreviousEmployment(id, body);
    };
    EmployeeController.prototype.updatePreviousEmployment = function (recId, body) {
        return this.employeeService.updatePreviousEmployment(recId, body);
    };
    EmployeeController.prototype.deletePreviousEmployment = function (recId) {
        return this.employeeService.deletePreviousEmployment(recId);
    };
    EmployeeController.prototype.addAward = function (id, body) {
        return this.employeeService.createAward(id, body);
    };
    EmployeeController.prototype.updateAward = function (recId, body) {
        return this.employeeService.updateAward(recId, body);
    };
    EmployeeController.prototype.deleteAward = function (recId) {
        return this.employeeService.deleteAward(recId);
    };
    EmployeeController.prototype.addEducation = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.createEducation(id, body)];
                    case 1:
                        row = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Education', row.id, row, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, row];
                }
            });
        });
    };
    EmployeeController.prototype.updateEducation = function (recId, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.updateEducation(recId, body)];
                    case 1:
                        row = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Education', recId, {}, row, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, row];
                }
            });
        });
    };
    EmployeeController.prototype.deleteEducation = function (recId, req) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.deleteEducation(recId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('Education', recId, {}, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, { message: 'Törölve' }];
                }
            });
        });
    };
    EmployeeController.prototype.addLanguage = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.createLanguageSkill(id, body)];
                    case 1:
                        row = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('LanguageSkill', row.id, row, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, row];
                }
            });
        });
    };
    EmployeeController.prototype.updateLanguage = function (recId, body) {
        return this.employeeService.updateLanguageSkill(recId, body);
    };
    EmployeeController.prototype.deleteLanguage = function (recId) {
        return this.employeeService.deleteLanguageSkill(recId);
    };
    EmployeeController.prototype.addMedical = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.createMedicalExamination(id, body)];
                    case 1:
                        row = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('MedicalExamination', row.id, row, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, row];
                }
            });
        });
    };
    EmployeeController.prototype.updateMedical = function (recId, body) {
        return this.employeeService.updateMedicalExamination(recId, body);
    };
    EmployeeController.prototype.deleteMedical = function (recId) {
        return this.employeeService.deleteMedicalExamination(recId);
    };
    EmployeeController.prototype.addDisciplinary = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.createDisciplinaryAction(id, body)];
                    case 1:
                        row = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('DisciplinaryAction', row.id, row, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, row];
                }
            });
        });
    };
    EmployeeController.prototype.updateDisciplinary = function (recId, body) {
        return this.employeeService.updateDisciplinaryAction(recId, body);
    };
    EmployeeController.prototype.deleteDisciplinary = function (recId) {
        return this.employeeService.deleteDisciplinaryAction(recId);
    };
    EmployeeController.prototype.addStudyContract = function (id, body, req) {
        return __awaiter(this, void 0, void 0, function () {
            var row;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.createStudyContract(id, body)];
                    case 1:
                        row = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('StudyContract', row.id, row, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, row];
                }
            });
        });
    };
    EmployeeController.prototype.updateStudyContract = function (recId, body) {
        return this.employeeService.updateStudyContract(recId, body);
    };
    EmployeeController.prototype.deleteStudyContract = function (recId) {
        return this.employeeService.deleteStudyContract(recId);
    };
    EmployeeController.prototype.create = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var employee;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.create(dto)];
                    case 1:
                        employee = _b.sent();
                        return [4 /*yield*/, this.auditService.logCreate('Employee', employee.id, employee, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, employee];
                }
            });
        });
    };
    EmployeeController.prototype.update = function (id, dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldEmployee, updated;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.findOne(id)];
                    case 1:
                        oldEmployee = _b.sent();
                        return [4 /*yield*/, this.employeeService.update(id, dto)];
                    case 2:
                        updated = _b.sent();
                        return [4 /*yield*/, this.auditService.logUpdate('Employee', id, oldEmployee, updated, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    EmployeeController.prototype.delete = function (id, req) {
        return __awaiter(this, void 0, void 0, function () {
            var oldEmployee;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.employeeService.findOne(id)];
                    case 1:
                        oldEmployee = _b.sent();
                        return [4 /*yield*/, this.employeeService.delete(id)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.auditService.logDelete('Employee', id, oldEmployee, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/, { message: 'Dolgozó törölve' }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Query)('skip')),
        __param(1, (0, common_1.Query)('take')),
        __param(2, (0, common_1.Query)('jobPositionId')),
        __param(3, (0, common_1.Query)('osztaly')),
        __param(4, (0, common_1.Query)('reszleg')),
        __param(5, (0, common_1.Query)('aktiv')),
        __param(6, (0, common_1.Query)('search')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_VIEW),
        __param(0, (0, common_1.Param)('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(':id/previous-employments'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "addPreviousEmployment", null);
    __decorate([
        (0, common_1.Put)('previous-employments/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('recId')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "updatePreviousEmployment", null);
    __decorate([
        (0, common_1.Delete)('previous-employments/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('recId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "deletePreviousEmployment", null);
    __decorate([
        (0, common_1.Post)(':id/awards'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "addAward", null);
    __decorate([
        (0, common_1.Put)('awards/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('recId')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "updateAward", null);
    __decorate([
        (0, common_1.Delete)('awards/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('recId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "deleteAward", null);
    __decorate([
        (0, common_1.Post)(':id/educations'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "addEducation", null);
    __decorate([
        (0, common_1.Put)('educations/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('recId')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "updateEducation", null);
    __decorate([
        (0, common_1.Delete)('educations/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('recId')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "deleteEducation", null);
    __decorate([
        (0, common_1.Post)(':id/language-skills'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "addLanguage", null);
    __decorate([
        (0, common_1.Put)('language-skills/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('recId')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "updateLanguage", null);
    __decorate([
        (0, common_1.Delete)('language-skills/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('recId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "deleteLanguage", null);
    __decorate([
        (0, common_1.Post)(':id/medical-examinations'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "addMedical", null);
    __decorate([
        (0, common_1.Put)('medical-examinations/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('recId')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "updateMedical", null);
    __decorate([
        (0, common_1.Delete)('medical-examinations/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('recId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "deleteMedical", null);
    __decorate([
        (0, common_1.Post)(':id/disciplinary-actions'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "addDisciplinary", null);
    __decorate([
        (0, common_1.Put)('disciplinary-actions/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('recId')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "updateDisciplinary", null);
    __decorate([
        (0, common_1.Delete)('disciplinary-actions/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('recId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "deleteDisciplinary", null);
    __decorate([
        (0, common_1.Post)(':id/study-contracts'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "addStudyContract", null);
    __decorate([
        (0, common_1.Put)('study-contracts/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('recId')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "updateStudyContract", null);
    __decorate([
        (0, common_1.Delete)('study-contracts/:recId'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('recId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], EmployeeController.prototype, "deleteStudyContract", null);
    __decorate([
        (0, common_1.Post)(),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_CREATE),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_EDIT),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "update", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, rbac_decorator_1.Permissions)(permission_enum_1.Permission.HR_DELETE),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Request)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], EmployeeController.prototype, "delete", null);
    EmployeeController = __decorate([
        (0, common_1.Controller)('hr/employees'),
        (0, common_1.UseGuards)(rbac_guard_1.RbacGuard),
        __metadata("design:paramtypes", [employee_service_1.EmployeeService,
            audit_service_1.AuditService])
    ], EmployeeController);
    return EmployeeController;
}());
exports.EmployeeController = EmployeeController;
