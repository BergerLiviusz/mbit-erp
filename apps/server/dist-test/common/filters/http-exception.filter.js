"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
var common_1 = require("@nestjs/common");
var AllExceptionsFilter = /** @class */ (function () {
    function AllExceptionsFilter() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    AllExceptionsFilter_1 = AllExceptionsFilter;
    AllExceptionsFilter.prototype.catch = function (exception, host) {
        var ctx = host.switchToHttp();
        var response = ctx.getResponse();
        var request = ctx.getRequest();
        var status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        var message = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : exception instanceof Error
                ? exception.message
                : 'Internal server error';
        // Log the full error details
        var errorDetails = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: typeof message === 'string' ? message : message.message || 'Unknown error',
            error: exception instanceof Error ? exception.stack : String(exception),
        };
        // Always log errors to console (will be captured by Electron logs)
        this.logger.error("HTTP ".concat(status, " Error: ").concat(request.method, " ").concat(request.url), exception instanceof Error ? exception.stack : String(exception));
        // Log full details
        console.error('=== EXCEPTION DETAILS ===');
        console.error(JSON.stringify(errorDetails, null, 2));
        console.error('========================');
        response.status(status).json({
            statusCode: status,
            message: typeof message === 'string' ? message : message.message || 'Internal server error',
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    };
    var AllExceptionsFilter_1;
    AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
        (0, common_1.Catch)()
    ], AllExceptionsFilter);
    return AllExceptionsFilter;
}());
exports.AllExceptionsFilter = AllExceptionsFilter;
