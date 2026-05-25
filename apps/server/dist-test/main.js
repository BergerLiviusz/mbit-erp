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
var dotenv = __importStar(require("dotenv"));
var path_1 = require("path");
var fs_1 = require("fs");
// In Electron mode, skip .env loading - environment variables are set by Electron's main process
// This prevents Replit or other development .env files from overriding Electron's DATABASE_URL
var isElectron = process.env.ELECTRON_RUN_AS_NODE === '1';
if (!isElectron) {
    // Load .env from server directory - try multiple paths with override=false to respect existing env vars
    var possibleEnvPaths = [
        (0, path_1.join)(process.cwd(), 'apps', 'server', '.env'),
        (0, path_1.join)(__dirname, '..', '.env'),
        (0, path_1.join)(process.cwd(), '.env'),
    ];
    for (var _i = 0, possibleEnvPaths_1 = possibleEnvPaths; _i < possibleEnvPaths_1.length; _i++) {
        var envPath = possibleEnvPaths_1[_i];
        if ((0, fs_1.existsSync)(envPath)) {
            // Use override=false to respect environment variables already set (e.g., by CI/CD)
            dotenv.config({ path: envPath, override: false });
            console.log("\uD83D\uDCC4 Loaded .env from: ".concat(envPath));
            break;
        }
    }
}
else {
    console.log('🔧 Electron mode detected - skipping .env file loading (using Electron-provided environment variables)');
}
var core_1 = require("@nestjs/core");
var common_1 = require("@nestjs/common");
var app_module_1 = require("./app.module");
var http_exception_filter_1 = require("./common/filters/http-exception.filter");
// Handle uncaught exceptions and unhandled rejections to prevent crashes
process.on('uncaughtException', function (error) {
    console.error('❌ Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    // Don't exit immediately - log and try to continue
    // The error might be recoverable
});
process.on('unhandledRejection', function (reason, promise) {
    console.error('❌ Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
    // Don't exit - log and continue
});
// Handle termination signals gracefully
process.on('SIGTERM', function () {
    console.error('⚠️ Received SIGTERM signal - shutting down gracefully...');
    console.log('⚠️ Received SIGTERM signal - shutting down gracefully...');
    // Flush stdout/stderr to ensure logs are captured
    process.stdout.write('⚠️ SIGTERM handler called\n');
    process.stderr.write('⚠️ SIGTERM handler called\n');
    // Give time for cleanup
    setTimeout(function () {
        console.log('⚠️ Exiting after SIGTERM...');
        process.exit(0);
    }, 1000);
});
process.on('SIGINT', function () {
    console.error('⚠️ Received SIGINT signal - shutting down gracefully...');
    console.log('⚠️ Received SIGINT signal - shutting down gracefully...');
    process.stdout.write('⚠️ SIGINT handler called\n');
    process.stderr.write('⚠️ SIGINT handler called\n');
    setTimeout(function () {
        console.log('⚠️ Exiting after SIGINT...');
        process.exit(0);
    }, 1000);
});
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, allowedOrigins, port, bindAddress, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    // Log environment info for debugging
                    console.log('🔍 Environment check:');
                    console.log("  - ELECTRON_RUN_AS_NODE: ".concat(process.env.ELECTRON_RUN_AS_NODE || 'not set'));
                    console.log("  - DATABASE_URL: ".concat(process.env.DATABASE_URL ? '***SET***' : 'NOT SET'));
                    console.log("  - PORT: ".concat(process.env.PORT || '3000 (default)'));
                    console.log("  - NODE_ENV: ".concat(process.env.NODE_ENV || 'not set'));
                    return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    // Add global exception filter for better error logging
                    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
                    allowedOrigins = isElectron
                        ? true // Allow all origins in Electron (file:// protocol)
                        : ['http://localhost:5000', 'http://127.0.0.1:5000', 'http://0.0.0.0:5000'];
                    app.enableCors({
                        origin: allowedOrigins,
                        credentials: true,
                        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                        allowedHeaders: ['Content-Type', 'Authorization'],
                    });
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true,
                        transform: true,
                    }));
                    port = process.env.PORT || 3000;
                    bindAddress = isElectron ? '127.0.0.1' : '0.0.0.0';
                    return [4 /*yield*/, app.listen(port, bindAddress)];
                case 2:
                    _a.sent();
                    console.log("\uD83D\uDE80 Mbit ERP szerver fut: http://".concat(bindAddress, ":").concat(port));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Fatal error during bootstrap:', error_1);
                    if (error_1 instanceof Error) {
                        console.error('Error message:', error_1.message);
                        console.error('Error stack:', error_1.stack);
                    }
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
bootstrap().catch(function (error) {
    console.error('❌ Unhandled error in bootstrap:', error);
    if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
    }
    // Don't exit immediately - wait a bit to see if it recovers
    setTimeout(function () {
        process.exit(1);
    }, 5000);
});
