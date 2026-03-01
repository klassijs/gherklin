"use strict";
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
var node_path_1 = require("node:path");
var output_js_1 = require("./output.js");
var utils_js_1 = require("./utils.js");
var config_js_1 = require("./config.js");
var types_js_1 = require("./types.js");
var html_reporter_js_1 = require("./reporters/html_reporter.js");
var stdout_reporter_js_1 = require("./reporters/stdout_reporter.js");
var json_reporter_js_1 = require("./reporters/json_reporter.js");
var logger_js_1 = require("./logger.js");
var chalk_1 = require("chalk");
var null_reporter_js_1 = require("./reporters/null_reporter.js");
var rule_loader_js_1 = require("./rule_loader.js");
var document_js_1 = require("./document.js");
var Runner = /** @class */ (function () {
    function Runner(gherklinConfig) {
        var _this = this;
        this.gherkinFiles = [];
        this.init = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, configBase, cwdBase, envFiles, envDir, f, dir, _b, dir, abs, _c, _i, _d, ruleName, schemaErrors;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!!this.config) return [3 /*break*/, 2];
                        // Discover config from file if none was injected
                        // (supports .ts/.yaml/.yml + GHERKLIN_CONFIG_FILE alias)
                        _a = this;
                        return [4 /*yield*/, new config_js_1.default().fromFile()];
                    case 1:
                        // Discover config from file if none was injected
                        // (supports .ts/.yaml/.yml + GHERKLIN_CONFIG_FILE alias)
                        _a.config = _f.sent();
                        _f.label = 2;
                    case 2:
                        configBase = (_e = this.config.configDirectory) !== null && _e !== void 0 ? _e : process.cwd();
                        cwdBase = process.cwd();
                        this.ruleLoader = new rule_loader_js_1.default(this.config);
                        this.reporter = this.getReporter();
                        envFiles = process.env.GHERKLIN_FEATURE_FILES;
                        envDir = process.env.GHERKLIN_FEATURE_DIR;
                        if (!envFiles) return [3 /*break*/, 3];
                        // Env-based file list: resolve relative to the current working directory (conventional)
                        this.gherkinFiles = envFiles
                            .split(',')
                            .map(function (f) { return f.trim(); })
                            .filter(Boolean)
                            .map(function (f) { return node_path_1.default.isAbsolute(f) ? f : node_path_1.default.resolve(cwdBase, f); });
                        return [3 /*break*/, 9];
                    case 3:
                        if (!this.config.featureFile) return [3 /*break*/, 4];
                        f = this.config.featureFile;
                        this.gherkinFiles = [node_path_1.default.isAbsolute(f) ? f : node_path_1.default.resolve(configBase, f)];
                        return [3 /*break*/, 9];
                    case 4:
                        if (!envDir) return [3 /*break*/, 6];
                        dir = node_path_1.default.isAbsolute(envDir) ? envDir : node_path_1.default.resolve(cwdBase, envDir);
                        _b = this;
                        return [4 /*yield*/, (0, utils_js_1.getFiles)(dir, 'feature')];
                    case 5:
                        _b.gherkinFiles = _f.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        if (!this.config.featureDirectory) return [3 /*break*/, 8];
                        dir = this.config.featureDirectory;
                        abs = node_path_1.default.isAbsolute(dir) ? dir : node_path_1.default.resolve(configBase, dir);
                        _c = this;
                        return [4 /*yield*/, (0, utils_js_1.getFiles)(abs, 'feature')];
                    case 7:
                        _c.gherkinFiles = _f.sent();
                        return [3 /*break*/, 9];
                    case 8: 
                    // Should be prevented by Config.validate(), but keep a friendly error
                    throw new Error('No feature source provided (featureDirectory/featureFile or GHERKLIN_FEATURE_DIR/FILES).');
                    case 9:
                        if (!this.config.rules) return [3 /*break*/, 13];
                        _i = 0, _d = Object.keys(this.config.rules);
                        _f.label = 10;
                    case 10:
                        if (!(_i < _d.length)) return [3 /*break*/, 13];
                        ruleName = _d[_i];
                        return [4 /*yield*/, this.ruleLoader.load(ruleName, this.config.rules[ruleName], this.config.customRulesDirectory)];
                    case 11:
                        _f.sent();
                        schemaErrors = this.ruleLoader.validateRules();
                        if (schemaErrors.size) {
                            (0, output_js_1.outputSchemaErrors)(schemaErrors);
                            return [2 /*return*/, {
                                    success: false,
                                    schemaErrors: schemaErrors,
                                    errorCount: 0,
                                    errors: new Map(),
                                }];
                        }
                        _f.label = 12;
                    case 12:
                        _i++;
                        return [3 /*break*/, 10];
                    case 13: return [2 /*return*/, {
                            success: true,
                            schemaErrors: new Map(),
                            errorCount: 0,
                            errors: new Map(),
                        }];
                }
            });
        }); };
        this.run = function () { return __awaiter(_this, void 0, void 0, function () {
            var _i, _a, filename, document_1, ruleErrors, maxAllowedErrors, allWarns, _b, _c, key, errors, hasErrorSeverity, totalErrorCount, success;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _i = 0, _a = this.gherkinFiles;
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        filename = _a[_i];
                        document_1 = new document_js_1.default(filename);
                        return [4 /*yield*/, document_1.load()];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, this.ruleLoader.runRules(document_1)];
                    case 3:
                        ruleErrors = _f.sent();
                        if (ruleErrors && ruleErrors.length) {
                            this.reporter.addErrors(filename, ruleErrors);
                        }
                        _f.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        if (this.reporter.errors.size) {
                            maxAllowedErrors = (_d = this.config.maxErrors) !== null && _d !== void 0 ? _d : 0;
                            allWarns = true;
                            for (_b = 0, _c = this.reporter.errors.keys(); _b < _c.length; _b++) {
                                key = _c[_b];
                                errors = (_e = this.reporter.errors.get(key)) !== null && _e !== void 0 ? _e : [];
                                hasErrorSeverity = errors.some(function (err) { return err.severity === types_js_1.Severity.error; });
                                if (hasErrorSeverity) {
                                    allWarns = false;
                                    break;
                                }
                            }
                            totalErrorCount = this.reporter.errorCount();
                            success = allWarns === true || totalErrorCount <= maxAllowedErrors;
                            this.reporter.write();
                            return [2 /*return*/, {
                                    success: success,
                                    errors: this.reporter.errors,
                                    errorCount: totalErrorCount,
                                    schemaErrors: new Map(),
                                }];
                        }
                        if (!(this.reporter instanceof null_reporter_js_1.default)) {
                            logger_js_1.default.info(chalk_1.default.green('✓ Gherklin found no errors!'));
                        }
                        return [2 /*return*/, {
                                success: true,
                                errors: new Map(),
                                errorCount: 0,
                                schemaErrors: new Map(),
                            }];
                }
            });
        }); };
        if (gherklinConfig) {
            // If CLI passed an inline config, create a Config from it.
            // (bin/gherklin.ts now injects configDirectory when a file was resolved.)
            this.config = new config_js_1.default(gherklinConfig);
        }
    }
    Runner.prototype.getReporter = function () {
        var _a;
        var reporterConfig = Object.assign({}, (_a = this.config) === null || _a === void 0 ? void 0 : _a.reporter, {
            configDirectory: this.config.configDirectory,
        });
        switch (reporterConfig.type) {
            case 'html':
                return new html_reporter_js_1.default(reporterConfig);
            case 'json':
                return new json_reporter_js_1.default(reporterConfig);
            case 'null':
                return new null_reporter_js_1.default(reporterConfig);
            case 'stdout':
            default:
                return new stdout_reporter_js_1.default(reporterConfig);
        }
    };
    return Runner;
}());
exports.default = Runner;
