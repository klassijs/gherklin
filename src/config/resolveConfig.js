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
exports.resolveConfig = resolveConfig;
// src/config/resolveConfig.ts
var node_path_1 = require("node:path");
var node_fs_1 = require("node:fs");
var cosmiconfig_1 = require("cosmiconfig");
var MODULE_NAME = 'gherklin';
// baseline places for cosmiconfig (you already had these)
var BASE_PLACES = [
    'package.json',
    '.gherklinrc', '.gherklinrc.json', '.gherklinrc.yaml', '.gherklinrc.yml',
    '.gherklinrc.js', '.gherklinrc.ts', '.gherklinrc.mjs', '.gherklinrc.cjs',
    'gherklin.config.ts', 'gherklin.config.js', 'gherklin.config.mjs',
    'gherklin.config.cjs', 'gherklin.config.yaml', 'gherklin.config.yml',
    '.config/gherklinrc', '.config/gherklinrc.json', '.config/gherklinrc.yaml',
    '.config/gherklinrc.yml', '.config/gherklinrc.js', '.config/gherklinrc.ts',
    '.config/gherklinrc.mjs', '.config/gherklinrc.cjs',
    '.config/gherklin.config.ts', '.config/gherklin.config.js',
    '.config/gherklin.config.mjs', '.config/gherklin.config.cjs',
    '.config/gherklin.config.yaml', '.config/gherklin.config.yml',
];
// filenames we consider a config in the “any subfolder” pass
var LOOSE_FILENAMES = new Set([
    'gherklin.config.ts',
    'gherklin.config.yaml',
    'gherklin.config.yml',
]);
// default scan parameters (overridable from env or options)
var DEFAULT_MAX_DEPTH = Number.parseInt(process.env.GHERKLIN_MAX_SEARCH_DEPTH || '', 10) || 3;
var DEFAULT_SKIP_DIRS = (process.env.GHERKLIN_SKIP_DIRS || '')
    .split(',')
    .map(function (s) { return s.trim(); })
    .filter(Boolean);
if (DEFAULT_SKIP_DIRS.length === 0) {
    DEFAULT_SKIP_DIRS.push('node_modules', '.git', 'dist', 'build', '.next', '.cache', '.idea', '.vscode', 'out', 'coverage', 'target');
}
/**
 * Main resolver:
 *   1) explicit path (--config / env)
 *   2) cosmiconfig search (from cwd)
 *   3) "any subfolder" nearest-first BFS for gherklin.config.{ts|yaml|yml}
 *   4) XDG
 *   5) fallback: undefined
 */
function resolveConfig() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var cwd, explicit, fp, res, fromCwd, maxDepth, skipDirs, loose, _i, _a, candidate, res;
        var _b, _c, _d, _e, _f;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    cwd = node_path_1.default.resolve((_b = opts.cwd) !== null && _b !== void 0 ? _b : process.cwd());
                    explicit = (_d = (_c = opts.explicitPath) !== null && _c !== void 0 ? _c : process.env.GHERKLIN_CONFIG_FILE) !== null && _d !== void 0 ? _d : process.env.GHERKLIN_CONFIG;
                    if (!(explicit === null || explicit === void 0 ? void 0 : explicit.trim())) return [3 /*break*/, 2];
                    fp = node_path_1.default.isAbsolute(explicit) ? explicit : node_path_1.default.resolve(cwd, explicit);
                    return [4 /*yield*/, loadConfigAtPath(fp)];
                case 1:
                    res = _g.sent();
                    if (res)
                        return [2 /*return*/, res];
                    throw new Error("Gherklin: config file not found or unreadable at: ".concat(fp));
                case 2: return [4 /*yield*/, searchFromDir(cwd, BASE_PLACES)];
                case 3:
                    fromCwd = _g.sent();
                    if (fromCwd)
                        return [2 /*return*/, fromCwd
                            // 3) "any subfolder" nearest-first BFS at each level up to root
                        ];
                    maxDepth = (_e = opts.maxScanDepth) !== null && _e !== void 0 ? _e : DEFAULT_MAX_DEPTH;
                    skipDirs = (_f = opts.skipDirs) !== null && _f !== void 0 ? _f : DEFAULT_SKIP_DIRS;
                    return [4 /*yield*/, searchUpLoose(cwd, maxDepth, skipDirs)];
                case 4:
                    loose = _g.sent();
                    if (loose)
                        return [2 /*return*/, loose
                            // 4) XDG (guard with existsSync)
                        ];
                    if (!(opts.enableXdg !== false)) return [3 /*break*/, 8];
                    _i = 0, _a = xdgCandidates();
                    _g.label = 5;
                case 5:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    candidate = _a[_i];
                    if (!(0, node_fs_1.existsSync)(candidate))
                        return [3 /*break*/, 7];
                    return [4 /*yield*/, loadConfigAtPath(candidate)];
                case 6:
                    res = _g.sent();
                    if (res)
                        return [2 /*return*/, res];
                    _g.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: 
                // 5) fallback
                return [2 /*return*/, { filepath: null, config: undefined }];
            }
        });
    });
}
function loadConfigAtPath(fp) {
    return __awaiter(this, void 0, void 0, function () {
        var explorer, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    explorer = (0, cosmiconfig_1.cosmiconfig)(MODULE_NAME);
                    return [4 /*yield*/, explorer.load(fp)];
                case 1:
                    result = _c.sent();
                    if (result && !result.isEmpty) {
                        return [2 /*return*/, {
                                filepath: (_a = result.filepath) !== null && _a !== void 0 ? _a : fp,
                                config: (_b = result.config) !== null && _b !== void 0 ? _b : undefined,
                            }];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function searchFromDir(dir, places) {
    return __awaiter(this, void 0, void 0, function () {
        var explorer, found;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    explorer = (0, cosmiconfig_1.cosmiconfig)(MODULE_NAME, {
                        mergeSearchPlaces: true,
                        searchPlaces: places,
                    });
                    return [4 /*yield*/, explorer.search(dir)];
                case 1:
                    found = _c.sent();
                    if (found && !found.isEmpty) {
                        return [2 /*return*/, {
                                filepath: (_a = found.filepath) !== null && _a !== void 0 ? _a : null,
                                config: (_b = found.config) !== null && _b !== void 0 ? _b : undefined,
                            }];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
/**
 * Search "loosely" by looking for gherklin.config.{ts|yaml|yml} in ANY subfolder
 * under each path as we walk up to the root—nearest first—and ignoring heavy/system
 * directories. Breadth-first to ensure "nearest" takes precedence.
 */
function searchUpLoose(start, maxDepth, skipDirs) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, root, _i, LOOSE_FILENAMES_1, fn, tryFile, res, nearest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dir = node_path_1.default.resolve(start);
                    root = node_path_1.default.parse(dir).root;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 7];
                    _i = 0, LOOSE_FILENAMES_1 = LOOSE_FILENAMES;
                    _a.label = 2;
                case 2:
                    if (!(_i < LOOSE_FILENAMES_1.length)) return [3 /*break*/, 5];
                    fn = LOOSE_FILENAMES_1[_i];
                    tryFile = node_path_1.default.join(dir, fn);
                    if (!(0, node_fs_1.existsSync)(tryFile)) return [3 /*break*/, 4];
                    return [4 /*yield*/, loadConfigAtPath(tryFile)];
                case 3:
                    res = _a.sent();
                    if (res)
                        return [2 /*return*/, res];
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, findNearestLooseInDir(dir, maxDepth, skipDirs)];
                case 6:
                    nearest = _a.sent();
                    if (nearest)
                        return [2 /*return*/, nearest];
                    if (dir === root)
                        return [3 /*break*/, 7];
                    dir = node_path_1.default.dirname(dir);
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, null];
            }
        });
    });
}
/**
 * BFS scan inside "dir", up to depth "maxDepth".
 * Skip directories listed in "skipDirs".
 * Stop at the first found config (nearest).
 */
function findNearestLooseInDir(dir, maxDepth, skipDirs) {
    return __awaiter(this, void 0, void 0, function () {
        function enqueueSubdirs(base, depth) {
            var entries;
            try {
                entries = (0, node_fs_1.readdirSync)(base, { withFileTypes: true });
            }
            catch (_a) {
                return;
            }
            for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                var e = entries_1[_i];
                if (!e.isDirectory())
                    continue;
                if (skipDirs.includes(e.name))
                    continue;
                var sub = node_path_1.default.join(base, e.name);
                if (!visited.has(sub)) {
                    visited.add(sub);
                    q.push({ d: sub, depth: depth });
                }
            }
        }
        var q, visited, _a, d, depth, _i, LOOSE_FILENAMES_2, fn, tryFile, res;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    q = [];
                    visited = new Set();
                    // seed: all immediate subdirs of dir
                    enqueueSubdirs(dir, 0);
                    _b.label = 1;
                case 1:
                    if (!q.length) return [3 /*break*/, 6];
                    _a = q.shift(), d = _a.d, depth = _a.depth;
                    _i = 0, LOOSE_FILENAMES_2 = LOOSE_FILENAMES;
                    _b.label = 2;
                case 2:
                    if (!(_i < LOOSE_FILENAMES_2.length)) return [3 /*break*/, 5];
                    fn = LOOSE_FILENAMES_2[_i];
                    tryFile = node_path_1.default.join(d, fn);
                    if (!(0, node_fs_1.existsSync)(tryFile)) return [3 /*break*/, 4];
                    return [4 /*yield*/, loadConfigAtPath(tryFile)];
                case 3:
                    res = _b.sent();
                    if (res)
                        return [2 /*return*/, res];
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    // continue BFS if we can go deeper
                    if (depth + 1 <= maxDepth) {
                        enqueueSubdirs(d, depth + 1);
                    }
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, null];
            }
        });
    });
}
/** Build XDG candidate paths */
function xdgCandidates() {
    var out = [];
    var _a = process.env, XDG_CONFIG_HOME = _a.XDG_CONFIG_HOME, XDG_CONFIG_DIRS = _a.XDG_CONFIG_DIRS, HOME = _a.HOME;
    var base = XDG_CONFIG_HOME || (HOME ? node_path_1.default.join(HOME, '.config') : undefined);
    if (base) {
        out.push(node_path_1.default.join(base, 'gherklin/gherklin.config.yaml'), node_path_1.default.join(base, 'gherklin/gherklin.config.yml'), node_path_1.default.join(base, 'gherklin/gherklin.config.ts'), node_path_1.default.join(base, 'gherklin/gherklin.config.js'));
    }
    var dirs = (XDG_CONFIG_DIRS && XDG_CONFIG_DIRS.split(':')) || ['/etc/xdg'];
    for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
        var d = dirs_1[_i];
        out.push(node_path_1.default.join(d, 'gherklin/gherklin.config.yaml'), node_path_1.default.join(d, 'gherklin/gherklin.config.yml'), node_path_1.default.join(d, 'gherklin/gherklin.config.ts'), node_path_1.default.join(d, 'gherklin/gherklin.config.js'));
    }
    return out;
}
