"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllingModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_module_1 = require("../prisma/prisma.module");
var audit_module_1 = require("../common/audit/audit.module");
var rbac_module_1 = require("../common/rbac/rbac.module");
var database_connection_controller_1 = require("./database-connection.controller");
var database_connection_service_1 = require("./database-connection.service");
var kpi_controller_1 = require("./kpi.controller");
var kpi_service_1 = require("./kpi.service");
var query_controller_1 = require("./query.controller");
var query_service_1 = require("./query.service");
var report_export_controller_1 = require("./report-export.controller");
var report_export_service_1 = require("./report-export.service");
var model_analysis_controller_1 = require("./model-analysis.controller");
var model_analysis_service_1 = require("./model-analysis.service");
var data_source_controller_1 = require("./data-source.controller");
var data_source_service_1 = require("./data-source.service");
var dashboard_controller_1 = require("./dashboard.controller");
var dashboard_aggregation_service_1 = require("./dashboard-aggregation.service");
var report_catalog_controller_1 = require("./report-catalog.controller");
var report_catalog_service_1 = require("./report-catalog.service");
var ControllingModule = /** @class */ (function () {
    function ControllingModule() {
    }
    ControllingModule = __decorate([
        (0, common_1.Module)({
            imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule, rbac_module_1.RbacModule],
            controllers: [
                database_connection_controller_1.DatabaseConnectionController,
                kpi_controller_1.KpiController,
                query_controller_1.QueryController,
                report_export_controller_1.ReportExportController,
                model_analysis_controller_1.ModelAnalysisController,
                data_source_controller_1.DataSourceController,
                dashboard_controller_1.DashboardController,
                report_catalog_controller_1.ReportCatalogController,
            ],
            providers: [
                database_connection_service_1.DatabaseConnectionService,
                kpi_service_1.KpiService,
                query_service_1.QueryService,
                report_export_service_1.ReportExportService,
                model_analysis_service_1.ModelAnalysisService,
                data_source_service_1.DataSourceService,
                dashboard_aggregation_service_1.DashboardAggregationService,
                report_catalog_service_1.ReportCatalogService,
            ],
            exports: [
                database_connection_service_1.DatabaseConnectionService,
                kpi_service_1.KpiService,
                query_service_1.QueryService,
                report_export_service_1.ReportExportService,
                model_analysis_service_1.ModelAnalysisService,
                data_source_service_1.DataSourceService,
                dashboard_aggregation_service_1.DashboardAggregationService,
                report_catalog_service_1.ReportCatalogService,
            ],
        })
    ], ControllingModule);
    return ControllingModule;
}());
exports.ControllingModule = ControllingModule;
