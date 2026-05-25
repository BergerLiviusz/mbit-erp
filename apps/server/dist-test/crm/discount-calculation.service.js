"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountCalculationService = void 0;
var common_1 = require("@nestjs/common");
var DiscountCalculationService = /** @class */ (function () {
    function DiscountCalculationService() {
    }
    DiscountCalculationService.prototype.applyRules = function (lines, rules, orderTotalBeforeRules, referenceDate) {
        var _this = this;
        if (referenceDate === void 0) { referenceDate = new Date(); }
        var sortedRules = __spreadArray([], rules, true).filter(function (r) { return _this.isRuleActive(r, referenceDate); })
            .sort(function (a, b) { var _a, _b; return ((_a = a.prioritas) !== null && _a !== void 0 ? _a : 100) - ((_b = b.prioritas) !== null && _b !== void 0 ? _b : 100); });
        var calculatedLines = lines.map(function (line) {
            var _a;
            var unitPrice = line.egysegAr;
            var appliedRules = [];
            var linePct = (_a = line.lineKedvezmeny) !== null && _a !== void 0 ? _a : 0;
            for (var _i = 0, sortedRules_1 = sortedRules; _i < sortedRules_1.length; _i++) {
                var rule = sortedRules_1[_i];
                if (rule.itemId && rule.itemId !== line.itemId)
                    continue;
                switch (rule.tipus) {
                    case 'MENNYISEGI':
                        if (rule.mennyisegiHatar != null &&
                            line.mennyiseg >= rule.mennyisegiHatar) {
                            unitPrice = unitPrice * (1 - rule.ertek / 100);
                            appliedRules.push(rule.id);
                        }
                        break;
                    case 'EGYEDI_AR':
                        unitPrice = rule.ertek;
                        appliedRules.push(rule.id);
                        break;
                    case 'ERTEKHATAR': {
                        var total = orderTotalBeforeRules !== null && orderTotalBeforeRules !== void 0 ? orderTotalBeforeRules : lines.reduce(function (s, l) { return s + l.mennyiseg * l.egysegAr; }, 0);
                        if (rule.ertekHatar != null && total >= rule.ertekHatar) {
                            unitPrice = unitPrice * (1 - rule.ertek / 100);
                            appliedRules.push(rule.id);
                        }
                        break;
                    }
                    case 'IDOSZAKI':
                        unitPrice = unitPrice * (1 - rule.ertek / 100);
                        appliedRules.push(rule.id);
                        break;
                }
            }
            var kedvezmeny = linePct;
            var osszeg = line.mennyiseg * unitPrice * (1 - Math.min(100, Math.max(0, kedvezmeny)) / 100);
            return {
                itemId: line.itemId,
                mennyiseg: line.mennyiseg,
                egysegAr: unitPrice,
                kedvezmeny: kedvezmeny,
                osszeg: osszeg,
                appliedRules: appliedRules,
            };
        });
        var osszeg = calculatedLines.reduce(function (s, l) { return s + l.osszeg; }, 0);
        var afa = osszeg * 0.27;
        var vegosszeg = osszeg + afa;
        return { lines: calculatedLines, osszeg: osszeg, afa: afa, vegosszeg: vegosszeg };
    };
    DiscountCalculationService.prototype.isRuleActive = function (rule, referenceDate) {
        if (rule.tipus === 'IDOSZAKI') {
            var start = rule.kezdetDatum ? new Date(rule.kezdetDatum) : null;
            var end = rule.vegesDatum ? new Date(rule.vegesDatum) : null;
            if (start && referenceDate < start)
                return false;
            if (end && referenceDate > end)
                return false;
        }
        return true;
    };
    DiscountCalculationService = __decorate([
        (0, common_1.Injectable)()
    ], DiscountCalculationService);
    return DiscountCalculationService;
}());
exports.DiscountCalculationService = DiscountCalculationService;
