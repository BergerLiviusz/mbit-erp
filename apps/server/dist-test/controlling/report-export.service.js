"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportExportService = void 0;
var common_1 = require("@nestjs/common");
var exceljs_1 = __importDefault(require("exceljs"));
var ReportExportService = /** @class */ (function () {
    function ReportExportService() {
    }
    ReportExportService.prototype.exportToExcel = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var workbook, worksheet, headerRow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        workbook = new exceljs_1.default.Workbook();
                        worksheet = workbook.addWorksheet('Riport');
                        // Title
                        if (data.title) {
                            worksheet.mergeCells('A1:' + String.fromCharCode(64 + data.headers.length) + '1');
                            worksheet.getCell('A1').value = data.title;
                            worksheet.getCell('A1').font = { size: 16, bold: true };
                            worksheet.getCell('A1').alignment = { horizontal: 'center' };
                            worksheet.addRow([]);
                        }
                        // Headers
                        worksheet.addRow(data.headers);
                        headerRow = worksheet.getRow(worksheet.rowCount);
                        headerRow.font = { bold: true };
                        headerRow.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFD3D3D3' },
                        };
                        headerRow.eachCell(function (cell) {
                            cell.border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' },
                            };
                        });
                        // Data rows
                        data.rows.forEach(function (row) {
                            worksheet.addRow(row);
                        });
                        // Adjust column widths
                        worksheet.columns.forEach(function (column, i) {
                            var maxLength = 0;
                            column.eachCell({ includeEmpty: true }, function (cell) {
                                var columnLength = cell.value ? cell.value.toString().length : 0;
                                if (columnLength > maxLength) {
                                    maxLength = columnLength;
                                }
                            });
                            column.width = maxLength < 10 ? 10 : maxLength + 2;
                        });
                        return [4 /*yield*/, workbook.xlsx.writeBuffer()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ReportExportService.prototype.exportToCsv = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var lines;
            return __generator(this, function (_a) {
                lines = [];
                if (data.title) {
                    lines.push(data.title);
                    lines.push('');
                }
                // Headers
                lines.push(data.headers.map(function (h) { return "\"".concat(h, "\""); }).join(','));
                // Data rows
                data.rows.forEach(function (row) {
                    lines.push(row.map(function (cell) { return "\"".concat(cell || '', "\""); }).join(','));
                });
                return [2 /*return*/, lines.join('\n')];
            });
        });
    };
    ReportExportService.prototype.exportToTxt = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var lines;
            return __generator(this, function (_a) {
                lines = [];
                if (data.title) {
                    lines.push(data.title);
                    lines.push('');
                }
                // Headers
                lines.push(data.headers.join('|'));
                // Data rows
                data.rows.forEach(function (row) {
                    lines.push(row.map(function (cell) { return cell || ''; }).join('|'));
                });
                return [2 /*return*/, lines.join('\n')];
            });
        });
    };
    ReportExportService.prototype.exportToXml = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var xml;
            var _this = this;
            return __generator(this, function (_a) {
                xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
                xml += '<Report>\n';
                if (data.title) {
                    xml += "  <Title>".concat(this.escapeXml(data.title), "</Title>\n");
                }
                xml += '  <Rows>\n';
                // Headers row
                xml += '    <Row type="header">\n';
                data.headers.forEach(function (header) {
                    xml += "      <Cell>".concat(_this.escapeXml(header), "</Cell>\n");
                });
                xml += '    </Row>\n';
                // Data rows
                data.rows.forEach(function (row) {
                    xml += '    <Row>\n';
                    row.forEach(function (cell, index) {
                        xml += "      <Cell name=\"".concat(_this.escapeXml(data.headers[index]), "\">").concat(_this.escapeXml((cell === null || cell === void 0 ? void 0 : cell.toString()) || ''), "</Cell>\n");
                    });
                    xml += '    </Row>\n';
                });
                xml += '  </Rows>\n';
                xml += '</Report>\n';
                return [2 /*return*/, xml];
            });
        });
    };
    ReportExportService.prototype.escapeXml = function (text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };
    ReportExportService = __decorate([
        (0, common_1.Injectable)()
    ], ReportExportService);
    return ReportExportService;
}());
exports.ReportExportService = ReportExportService;
