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
var node_fs_1 = require("node:fs");
var node_url_1 = require("node:url");
var yaml_1 = require("yaml");
var cosmiconfig_1 = require("cosmiconfig");
/**
 * The config class is responsible for loading and parsing config.
 *
 * It can accept inline config passed to its constructor.
 * It can also load configuration from a gherklin.config.ts/.yaml/.yml file.
 *
 * Once loaded, the config is parsed and added to member variables for access.
 */
var Config = /** @class */ (function () {
    function Config(inlineConfig) {
        var _this = this;
        this.parse = function (config) {
            _this.configDirectory = config.configDirectory;
            _this.customRulesDirectory = config.customRulesDirectory;
            _this.featureDirectory = config.featureDirectory;
            _this.rules = config.rules;
            _this.reporter = config.reporter;
            _this.featureFile = config.featureFile;
            _this.maxErrors = config.maxErrors;
            _this.fix = config.fix;
        };
        /**
         * Attempts to load config from a gherklin config file, discovered from "anywhere".
         * Order:
         *  1) GHERKLIN_CONFIG_FILE (or GHERKLIN_CONFIG) absolute or relative to CWD
         *  2) cosmiconfig search (walk up from CWD; supports package.json, rc files, .config/)
         *  3) XDG locations ($XDG_CONFIG_HOME, then each path in $XDG_CONFIG_DIRS)
         *  4) legacy root files in CWD: gherklin.config.ts / .yaml / .yml
         */
        this.fromFile = function () { return __awaiter(_this, void 0, void 0, function () {
            var configFile, configDir, config;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getConfigFile()];
                    case 1:
                        configFile = _a.sent();
                        configDir = node_path_1.default.dirname(configFile);
                        return [4 /*yield*/, this.loadConfigFromFile(configFile)];
                    case 2:
                        config = _a.sent();
                        config.configDirectory = configDir;
                        this.parse(config);
                        this.validate();
                        return [2 /*return*/, this];
                }
            });
        }); };
        /**
         * Resolve the path to the config file to use (see "fromFile" for order).
         */
        this.getConfigFile = function () { return __awaiter(_this, void 0, void 0, function () {
            var envPath, candidate, discovered, xdg, filesToCheck, _i, filesToCheck_1, file, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        envPath = process.env.GHERKLIN_CONFIG_FILE || process.env.GHERKLIN_CONFIG;
                        if (envPath) {
                            candidate = node_path_1.default.isAbsolute(envPath) ? envPath : node_path_1.default.join(process.cwd(), envPath);
                            if ((0, node_fs_1.existsSync)(candidate)) {
                                return [2 /*return*/, candidate];
                            }
                            throw new Error("GHERKLIN_CONFIG_FILE was set to \"".concat(envPath, "\", but no file was found at \"").concat(candidate, "\"."));
                        }
                        return [4 /*yield*/, this.resolveViaCosmiconfig()];
                    case 1:
                        discovered = _a.sent();
                        if (discovered)
                            return [2 /*return*/, discovered
                                // 3) XDG (~/.config/gherklin/gherklin.config.* and entries in XDG_CONFIG_DIRS)
                            ];
                        xdg = this.resolveViaXdg();
                        if (xdg)
                            return [2 /*return*/, xdg
                                // 4) Legacy root files beside CWD
                            ];
                        filesToCheck = ['gherklin.config.ts', 'gherklin.config.yaml', 'gherklin.config.yml'];
                        for (_i = 0, filesToCheck_1 = filesToCheck; _i < filesToCheck_1.length; _i++) {
                            file = filesToCheck_1[_i];
                            p = node_path_1.default.join(process.cwd(), file);
                            if ((0, node_fs_1.existsSync)(p))
                                return [2 /*return*/, p];
                        }
                        throw new Error('Could not find a Gherklin config. Looked for gherklin.config.ts, gherklin.config.yaml, gherklin.config.yml or used GHERKLIN_CONFIG_FILE.');
                }
            });
        }); };
        /**
         * Use cosmiconfig to search for a config in conventional places while
         * walking up the directory tree from CWD.
         */
        this.resolveViaCosmiconfig = function () { return __awaiter(_this, void 0, void 0, function () {
            var searchPlaces, explorer, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchPlaces = [
                            'package.json',
                            // rc files at root
                            '.gherklinrc',
                            '.gherklinrc.json',
                            '.gherklinrc.yaml',
                            '.gherklinrc.yml',
                            '.gherklinrc.js',
                            '.gherklinrc.ts',
                            '.gherklinrc.mjs',
                            '.gherklinrc.cjs',
                            // rc files under .config/
                            '.config/gherklinrc',
                            '.config/gherklinrc.json',
                            '.config/gherklinrc.yaml',
                            '.config/gherklinrc.yml',
                            '.config/gherklinrc.js',
                            '.config/gherklinrc.ts',
                            '.config/gherklinrc.mjs',
                            '.config/gherklinrc.cjs',
                            // dedicated config files at root
                            'gherklin.config.ts',
                            'gherklin.config.js',
                            'gherklin.config.mjs',
                            'gherklin.config.cjs',
                            'gherklin.config.yaml',
                            'gherklin.config.yml',
                            // dedicated config files under .config/
                            '.config/gherklin.config.ts',
                            '.config/gherklin.config.js',
                            '.config/gherklin.config.mjs',
                            '.config/gherklin.config.cjs',
                            '.config/gherklin.config.yaml',
                            '.config/gherklin.config.yml',
                        ];
                        explorer = (0, cosmiconfig_1.cosmiconfig)('gherklin', { mergeSearchPlaces: true, searchPlaces: searchPlaces });
                        return [4 /*yield*/, explorer.search(process.cwd())];
                    case 1:
                        result = _a.sent();
                        if (result && !result.isEmpty && result.filepath) {
                            return [2 /*return*/, result.filepath];
                        }
                        return [2 /*return*/, null];
                }
            });
        }); };
        /**
         * Check XDG locations for a global/shared config.
         * - $XDG_CONFIG_HOME/gherklin/gherklin.config.*
         * - each path in $XDG_CONFIG_DIRS
         */
        this.resolveViaXdg = function () {
            var _a = process.env, XDG_CONFIG_HOME = _a.XDG_CONFIG_HOME, XDG_CONFIG_DIRS = _a.XDG_CONFIG_DIRS, HOME = _a.HOME;
            var candidates = [];
            var base = XDG_CONFIG_HOME || (HOME ? node_path_1.default.join(HOME, '.config') : undefined);
            if (base) {
                candidates.push(node_path_1.default.join(base, 'gherklin/gherklin.config.yaml'), node_path_1.default.join(base, 'gherklin/gherklin.config.yml'), node_path_1.default.join(base, 'gherklin/gherklin.config.ts'), node_path_1.default.join(base, 'gherklin/gherklin.config.js'));
            }
            var dirs = (XDG_CONFIG_DIRS && XDG_CONFIG_DIRS.split(':')) || ['/etc/xdg'];
            for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
                var d = dirs_1[_i];
                candidates.push(node_path_1.default.join(d, 'gherklin/gherklin.config.yaml'), node_path_1.default.join(d, 'gherklin/gherklin.config.yml'), node_path_1.default.join(d, 'gherklin/gherklin.config.ts'), node_path_1.default.join(d, 'gherklin/gherklin.config.js'));
            }
            for (var _b = 0, candidates_1 = candidates; _b < candidates_1.length; _b++) {
                var c = candidates_1[_b];
                if ((0, node_fs_1.existsSync)(c))
                    return c;
            }
            return null;
        };
        /**
         * Load the configuration from a resolved file path.
         * Supports:
         *  - .ts / .mts / .cts (ESM default export)
         *  - .yaml / .yml (YAML)
         */
        this.loadConfigFromFile = function (filePath) { return __awaiter(_this, void 0, void 0, function () {
            var lower, module_1, content;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lower = filePath.toLowerCase();
                        if (!(lower.endsWith('.ts') || lower.endsWith('.mts') || lower.endsWith('.cts'))) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve("".concat((0, node_url_1.pathToFileURL)(filePath).href)).then(function (s) { return require(s); })];
                    case 1:
                        module_1 = _a.sent();
                        if (!('default' in module_1)) {
                            throw new Error("Config file \"".concat(filePath, "\" does not export a default object"));
                        }
                        return [2 /*return*/, module_1.default];
                    case 2:
                        if (lower.endsWith('.yaml') || lower.endsWith('.yml')) {
                            content = (0, node_fs_1.readFileSync)(filePath, { encoding: 'utf-8' });
                            return [2 /*return*/, (0, yaml_1.parse)(content)];
                        }
                        throw new Error("Unsupported config file \"".concat(filePath, "\". Expected .ts/.mts/.cts or .yaml/.yml"));
                }
            });
        }); };
        /**
         * Validates that the configuration contains all the necessary
         * information for Gherklin to run.
         */
        this.validate = function () {
            var hasEnvFiles = !!process.env.GHERKLIN_FEATURE_FILES;
            var hasEnvDir = !!process.env.GHERKLIN_FEATURE_DIR;
            if (!_this.featureDirectory && !_this.featureFile && !hasEnvFiles && !hasEnvDir) {
                throw new Error('Please specify either a featureDirectory or featureFile configuration option, or set GHERKLIN_FEATURE_DIR or GHERKLIN_FEATURE_FILES environment variable.');
            }
            if (!_this.rules || !Object.keys(_this.rules).length) {
                throw new Error('Please specify a list of rules in your configuration.');
            }
            if (_this.featureDirectory && _this.featureFile) {
                throw new Error('Please only specify either a feature file or feature directory.');
            }
        };
        if (inlineConfig) {
            this.parse(inlineConfig);
            this.validate();
        }
    }
    return Config;
}());
exports.default = Config;
