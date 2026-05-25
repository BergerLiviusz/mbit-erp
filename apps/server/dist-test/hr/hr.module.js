"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_module_1 = require("../prisma/prisma.module");
var audit_module_1 = require("../common/audit/audit.module");
var rbac_module_1 = require("../common/rbac/rbac.module");
var storage_module_1 = require("../common/storage/storage.module");
var team_module_1 = require("../team/team.module");
var job_position_controller_1 = require("./job-position.controller");
var job_position_service_1 = require("./job-position.service");
var employee_controller_1 = require("./employee.controller");
var employee_service_1 = require("./employee.service");
var contract_controller_1 = require("./contract.controller");
var contract_service_1 = require("./contract.service");
var report_controller_1 = require("./report.controller");
var report_service_1 = require("./report.service");
var cafeteria_controller_1 = require("./cafeteria.controller");
var cafeteria_service_1 = require("./cafeteria.service");
var recruitment_controller_1 = require("./recruitment.controller");
var recruitment_service_1 = require("./recruitment.service");
var time_tracking_controller_1 = require("./time-tracking.controller");
var time_tracking_service_1 = require("./time-tracking.service");
var leave_controller_1 = require("./leave.controller");
var leave_service_1 = require("./leave.service");
var performance_controller_1 = require("./performance.controller");
var performance_service_1 = require("./performance.service");
var onboarding_controller_1 = require("./onboarding.controller");
var onboarding_service_1 = require("./onboarding.service");
var hr_mail_service_1 = require("./hr-mail.service");
var HrModule = /** @class */ (function () {
    function HrModule() {
    }
    HrModule = __decorate([
        (0, common_1.Module)({
            imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule, rbac_module_1.RbacModule, storage_module_1.StorageModule, team_module_1.TeamModule],
            controllers: [
                job_position_controller_1.JobPositionController,
                employee_controller_1.EmployeeController,
                contract_controller_1.ContractController,
                report_controller_1.HrReportController,
                cafeteria_controller_1.CafeteriaController,
                recruitment_controller_1.RecruitmentController,
                time_tracking_controller_1.HrTimeTrackingController,
                leave_controller_1.HrLeaveController,
                performance_controller_1.HrPerformanceController,
                onboarding_controller_1.HrOnboardingController,
            ],
            providers: [
                job_position_service_1.JobPositionService,
                employee_service_1.EmployeeService,
                contract_service_1.ContractService,
                report_service_1.HrReportService,
                cafeteria_service_1.CafeteriaService,
                recruitment_service_1.HrRecruitmentService,
                time_tracking_service_1.HrTimeTrackingService,
                leave_service_1.HrLeaveService,
                performance_service_1.HrPerformanceService,
                onboarding_service_1.HrOnboardingService,
                hr_mail_service_1.HrMailService,
            ],
            exports: [job_position_service_1.JobPositionService, employee_service_1.EmployeeService, contract_service_1.ContractService, report_service_1.HrReportService, hr_mail_service_1.HrMailService],
        })
    ], HrModule);
    return HrModule;
}());
exports.HrModule = HrModule;
