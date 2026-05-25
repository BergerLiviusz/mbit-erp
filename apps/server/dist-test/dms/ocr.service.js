"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.OcrService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var storage_service_1 = require("../common/storage/storage.service");
var tesseract_js_1 = require("tesseract.js");
var pdfParse = __importStar(require("pdf-parse"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs/promises"));
var sharp_1 = __importDefault(require("sharp"));
var OcrService = /** @class */ (function () {
    function OcrService(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
        this.logger = new common_1.Logger(OcrService_1.name);
        this.worker = null;
    }
    OcrService_1 = OcrService;
    OcrService.prototype.createJob = function (documentId) {
        return __awaiter(this, void 0, void 0, function () {
            var job;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prisma.oCRJob.deleteMany({ where: { documentId: documentId } })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.prisma.oCRJob.create({
                                data: {
                                    documentId: documentId,
                                    allapot: 'beerkezett',
                                    nyelv: 'hun',
                                },
                            })];
                    case 2:
                        job = _a.sent();
                        this.processJob(job.id).catch(function (error) {
                            _this.logger.error("OCR job ".concat(job.id, " processing failed:"), error);
                        });
                        return [2 /*return*/, job];
                }
            });
        });
    };
    OcrService.prototype.findAll = function () {
        return __awaiter(this, arguments, void 0, function (skip, take, userId, isAdmin) {
            var accessFilter, _a, total, items;
            if (skip === void 0) { skip = 0; }
            if (take === void 0) { take = 50; }
            if (isAdmin === void 0) { isAdmin = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        accessFilter = !isAdmin && userId
                            ? {
                                document: {
                                    OR: [{ createdById: userId }, { access: { some: { userId: userId } } }],
                                },
                            }
                            : {};
                        return [4 /*yield*/, Promise.all([
                                this.prisma.oCRJob.count({ where: accessFilter }),
                                this.prisma.oCRJob.findMany({
                                    where: accessFilter,
                                    skip: skip,
                                    take: take,
                                    include: {
                                        document: {
                                            select: {
                                                id: true,
                                                nev: true,
                                                iktatoSzam: true,
                                                fajlNev: true,
                                                allapot: true,
                                            },
                                        },
                                    },
                                    orderBy: { createdAt: 'desc' },
                                }),
                            ])];
                    case 1:
                        _a = _b.sent(), total = _a[0], items = _a[1];
                        return [2 /*return*/, { total: total, items: items }];
                }
            });
        });
    };
    OcrService.prototype.getJobStatus = function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prisma.oCRJob.findUnique({
                        where: { id: jobId },
                    })];
            });
        });
    };
    OcrService.prototype.processJob = function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var job, filePath, extractedText, ocrConfidence, pdfBuffer, pdfData, ocrResult, error_1, pdfBuffer, ocrResult, preprocessedPath, ocrResult, error_2, txtFilename, txtBuffer, txtRelativePath, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 25, , 27]);
                        return [4 /*yield*/, this.prisma.oCRJob.findUnique({
                                where: { id: jobId },
                                include: { document: true },
                            })];
                    case 1:
                        job = _a.sent();
                        if (!job) {
                            this.logger.error("Job ".concat(jobId, " not found"));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.prisma.oCRJob.update({
                                where: { id: jobId },
                                data: { allapot: 'feldolgozas', feldolgozasKezdet: new Date() },
                            })];
                    case 2:
                        _a.sent();
                        if (!job.document.fajlUtvonal) {
                            throw new Error('Document has no file path');
                        }
                        filePath = this.storage.getAbsolutePath(job.document.fajlUtvonal);
                        extractedText = '';
                        ocrConfidence = void 0;
                        if (!(job.document.mimeType === 'application/pdf')) return [3 /*break*/, 13];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 9, , 12]);
                        return [4 /*yield*/, this.storage.readFile(job.document.fajlUtvonal)];
                    case 4:
                        pdfBuffer = _a.sent();
                        return [4 /*yield*/, pdfParse(pdfBuffer)];
                    case 5:
                        pdfData = _a.sent();
                        extractedText = pdfData.text.trim();
                        if (!(extractedText.length > 0)) return [3 /*break*/, 6];
                        this.logger.log("PDF text extracted using pdf-parse: ".concat(extractedText.length, " characters"));
                        return [3 /*break*/, 8];
                    case 6:
                        this.logger.log('PDF has no embedded text, using page OCR (first page)');
                        return [4 /*yield*/, this.extractTextFromScannedPdf(pdfBuffer)];
                    case 7:
                        ocrResult = _a.sent();
                        extractedText = ocrResult.text;
                        ocrConfidence = ocrResult.confidence;
                        _a.label = 8;
                    case 8: return [3 /*break*/, 12];
                    case 9:
                        error_1 = _a.sent();
                        this.logger.warn("pdf-parse failed, falling back to page OCR: ".concat(error_1));
                        return [4 /*yield*/, this.storage.readFile(job.document.fajlUtvonal)];
                    case 10:
                        pdfBuffer = _a.sent();
                        return [4 /*yield*/, this.extractTextFromScannedPdf(pdfBuffer)];
                    case 11:
                        ocrResult = _a.sent();
                        extractedText = ocrResult.text;
                        ocrConfidence = ocrResult.confidence;
                        return [3 /*break*/, 12];
                    case 12: return [3 /*break*/, 21];
                    case 13: return [4 /*yield*/, this.preprocessImage(filePath, job.document.mimeType)];
                    case 14:
                        preprocessedPath = _a.sent();
                        _a.label = 15;
                    case 15:
                        _a.trys.push([15, , 17, 21]);
                        return [4 /*yield*/, this.extractTextWithTesseract(preprocessedPath)];
                    case 16:
                        ocrResult = _a.sent();
                        extractedText = ocrResult.text;
                        ocrConfidence = ocrResult.confidence;
                        return [3 /*break*/, 21];
                    case 17:
                        _a.trys.push([17, 19, , 20]);
                        return [4 /*yield*/, fs.unlink(preprocessedPath)];
                    case 18:
                        _a.sent();
                        return [3 /*break*/, 20];
                    case 19:
                        error_2 = _a.sent();
                        this.logger.warn("Failed to delete preprocessed image: ".concat(error_2));
                        return [3 /*break*/, 20];
                    case 20: return [7 /*endfinally*/];
                    case 21:
                        txtFilename = "".concat(path.basename(job.document.fajlNev, path.extname(job.document.fajlNev)), "_ocr.txt");
                        txtBuffer = Buffer.from(extractedText, 'utf-8');
                        return [4 /*yield*/, this.storage.saveFile('ocr', txtFilename, txtBuffer)];
                    case 22:
                        txtRelativePath = _a.sent();
                        return [4 /*yield*/, this.prisma.oCRJob.update({
                                where: { id: jobId },
                                data: {
                                    allapot: 'kesz',
                                    eredmeny: extractedText,
                                    txtFajlUtvonal: txtRelativePath,
                                    pontossag: ocrConfidence,
                                    feldolgozasVeg: new Date(),
                                },
                            })];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, this.prisma.document.update({
                                where: { id: job.documentId },
                                data: {
                                    tartalom: extractedText,
                                },
                            })];
                    case 24:
                        _a.sent();
                        this.logger.log("OCR job ".concat(jobId, " completed successfully with ").concat(extractedText.length, " characters"));
                        return [3 /*break*/, 27];
                    case 25:
                        error_3 = _a.sent();
                        this.logger.error("OCR job ".concat(jobId, " failed:"), error_3);
                        return [4 /*yield*/, this.prisma.oCRJob.update({
                                where: { id: jobId },
                                data: {
                                    allapot: 'hiba',
                                    hibalista: error_3 instanceof Error ? error_3.message : 'Unknown error',
                                    feldolgozasVeg: new Date(),
                                },
                            })];
                    case 26:
                        _a.sent();
                        return [3 /*break*/, 27];
                    case 27: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Scanned PDF: rasterize first page via sharp (libvips PDF support) then OCR.
     * Multi-page full OCR is not supported — documented limitation.
     */
    OcrService.prototype.extractTextFromScannedPdf = function (pdfBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var tempDir, pngPath, preprocessed, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempDir = this.storage.getPath('temp');
                        return [4 /*yield*/, this.storage.ensureDir(tempDir)];
                    case 1:
                        _a.sent();
                        pngPath = path.join(tempDir, "pdf-ocr-".concat(Date.now(), "-").concat(Math.random().toString(16).slice(2), ".png"));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 11, 12, 14]);
                        return [4 /*yield*/, (0, sharp_1.default)(pdfBuffer, { page: 0, density: 200 })
                                .greyscale()
                                .normalize()
                                .png()
                                .toFile(pngPath)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.preprocessImage(pngPath, 'image/png')];
                    case 4:
                        preprocessed = _a.sent();
                        _a.label = 5;
                    case 5:
                        _a.trys.push([5, , 7, 10]);
                        return [4 /*yield*/, this.extractTextWithTesseract(preprocessed)];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7:
                        if (!(preprocessed !== pngPath)) return [3 /*break*/, 9];
                        return [4 /*yield*/, fs.unlink(preprocessed).catch(function () { return undefined; })];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [7 /*endfinally*/];
                    case 10: return [3 /*break*/, 14];
                    case 11:
                        error_4 = _a.sent();
                        this.logger.warn("PDF page rasterization failed (first page only supported): ".concat(error_4));
                        throw new Error('Szkennelt PDF OCR nem sikerült (első oldal). Ellenőrizze, hogy a libvips PDF támogatás elérhető-e, vagy használjon képfájlt.');
                    case 12: return [4 /*yield*/, fs.unlink(pngPath).catch(function () { return undefined; })];
                    case 13:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Preprocess image to improve OCR accuracy
     */
    OcrService.prototype.preprocessImage = function (filePath, mimeType) {
        return __awaiter(this, void 0, void 0, function () {
            var isImage, outputPath, imageBuffer, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isImage = mimeType.startsWith('image/');
                        if (!isImage) {
                            return [2 /*return*/, filePath]; // Return original path for non-image files
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        outputPath = "".concat(filePath, ".preprocessed.png");
                        return [4 /*yield*/, fs.readFile(filePath)];
                    case 2:
                        imageBuffer = _a.sent();
                        // Preprocess with sharp for better OCR accuracy
                        return [4 /*yield*/, (0, sharp_1.default)(imageBuffer)
                                .greyscale() // Convert to grayscale for better OCR
                                .normalize() // Normalize brightness and contrast
                                .sharpen({ sigma: 1, m1: 1, m2: 2, x1: 2, y2: 10, y3: 20 }) // Sharpen image
                                .linear(1.2, -(128 * 0.2)) // Increase contrast
                                .png({ quality: 100, compressionLevel: 9 })
                                .toFile(outputPath)];
                    case 3:
                        // Preprocess with sharp for better OCR accuracy
                        _a.sent();
                        this.logger.debug("Image preprocessed: ".concat(filePath, " -> ").concat(outputPath));
                        return [2 /*return*/, outputPath];
                    case 4:
                        error_5 = _a.sent();
                        this.logger.warn("Image preprocessing failed, using original: ".concat(error_5));
                        return [2 /*return*/, filePath]; // Fallback to original if preprocessing fails
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Extract text using Tesseract.js with optimized configuration
     */
    OcrService.prototype.extractTextWithTesseract = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, text, confidence, cleanedText, error_6;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!this.worker) return [3 /*break*/, 3];
                        _a = this;
                        return [4 /*yield*/, (0, tesseract_js_1.createWorker)('hun', undefined, {
                                logger: function (m) {
                                    // Only log important messages
                                    if (m.status === 'recognizing text' && m.progress === 1) {
                                        _this.logger.debug('OCR recognition completed');
                                    }
                                },
                            })];
                    case 1:
                        _a.worker = _c.sent();
                        // Set optimized OCR parameters
                        return [4 /*yield*/, this.worker.setParameters({
                                tessedit_pageseg_mode: '6', // Assume uniform block of text
                                tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÉÍÓÖŐÚÜŰáéíóöőúüű.,;:!?()[]{}\'"-+*/=<>@#$%&_|\\/~`', // Hungarian characters
                                tessedit_ocr_engine_mode: '1', // Neural nets LSTM engine only
                            })];
                    case 2:
                        // Set optimized OCR parameters
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.worker.recognize(filePath)];
                    case 4:
                        _b = (_c.sent()).data, text = _b.text, confidence = _b.confidence;
                        this.logger.debug("OCR completed with confidence: ".concat(confidence, "%"));
                        cleanedText = text
                            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                            .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
                            .trim();
                        return [2 /*return*/, { text: cleanedText, confidence: confidence }];
                    case 5:
                        error_6 = _c.sent();
                        this.logger.error("Tesseract recognition failed: ".concat(error_6));
                        throw error_6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    OcrService.prototype.onModuleDestroy = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.worker) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.worker.terminate()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    var OcrService_1;
    OcrService = OcrService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [prisma_service_1.PrismaService,
            storage_service_1.StorageService])
    ], OcrService);
    return OcrService;
}());
exports.OcrService = OcrService;
