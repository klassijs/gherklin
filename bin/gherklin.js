#!/usr/bin/env node
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
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_fs_2 = require("node:fs");
var node_path_2 = require("node:path");
var node_url_1 = require("node:url");
var resolveConfig_js_1 = require("../src/config/resolveConfig.js");
// NOTE: adjust this import if Runner is exported from a different module in your fork
var index_js_1 = require("../src/index.js");
function parseArgs(argv) {
    var args = {};
    for (var i = 0; i < argv.length; i++) {
        var a = argv[i];
        switch (a) {
            case '--config':
            case '-c':
                args.config = argv[++i];
                break;
            case '--cwd':
                args.cwd = argv[++i];
                break;
            case '--no-xdg':
                args.noXdg = true;
                break;
            case '--help':
            case '-h':
                args.help = true;
                break;
            case '--version':
            case '-v':
                args.version = true;
                break;
            default:
                // ignore positional for now
                break;
        }
    }
    return args;
}
function printHelp() {
    console.log("\nUsage: gherklin [options]\n\nOptions:\n  -c, --config <path>   Load config file from explicit path\n      --cwd <dir>       Start search from this directory (monorepos)\n      --no-xdg          Disable XDG lookups\n  -h, --help            Show this help\n  -v, --version         Print version\n");
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, targetCwd, here, pkg, config, runner, init, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = parseArgs(process.argv.slice(2));
                    // If a working directory is specified, switch to it immediately.
                    if (args.cwd) {
                        targetCwd = node_path_1.default.isAbsolute(args.cwd)
                            ? args.cwd
                            : node_path_1.default.resolve(process.cwd(), args.cwd);
                        if (!node_fs_1.default.existsSync(targetCwd) || !node_fs_1.default.statSync(targetCwd).isDirectory()) {
                            console.error("\n\u2716 The --cwd path does not exist or is not a directory:\n   ".concat(targetCwd, "\n\n") +
                                "Tips:\n" +
                                "  \u2022 Use an absolute path, or a path relative to the directory you run the CLI from.\n" +
                                "  \u2022 Example: --cwd ./packages/app\n");
                            process.exit(2);
                        }
                        try {
                            process.chdir(targetCwd);
                        }
                        catch (err) {
                            console.error("\n\u2716 Failed to change directory to:\n   ".concat(targetCwd, "\n\n").concat((err === null || err === void 0 ? void 0 : err.message) || err, "\n"));
                            process.exit(2);
                        }
                    }
                    if (args.help) {
                        printHelp();
                        process.exit(0);
                    }
                    if (args.version) {
                        here = (0, node_path_2.dirname)((0, node_url_1.fileURLToPath)(import.meta.url));
                        pkg = JSON.parse((0, node_fs_2.readFileSync)((0, node_path_2.resolve)(here, '..', 'package.json'), 'utf8'));
                        console.log(pkg.version);
                        process.exit(0);
                    }
                    return [4 /*yield*/, (0, resolveConfig_js_1.resolveConfig)({
                            // no need to pass args.cwd any more; we already changed into it
                            enableXdg: !args.noXdg,
                            explicitPath: args.config
                        })];
                case 1:
                    config = (_a.sent()).config;
                    runner = new index_js_1.Runner(config);
                    return [4 /*yield*/, runner.init()];
                case 2:
                    init = _a.sent();
                    if (!init.success) {
                        console.error('Invalid Gherklin configuration:');
                        console.error(init.schemaErrors);
                        process.exit(2);
                    }
                    return [4 /*yield*/, runner.run()];
                case 3:
                    result = _a.sent();
                    process.exit(result.success ? 0 : 1);
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (e) {
    console.error((e === null || e === void 0 ? void 0 : e.stack) || (e === null || e === void 0 ? void 0 : e.message) || e);
    process.exit(1);
});
