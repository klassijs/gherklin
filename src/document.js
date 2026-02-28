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
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var messages_1 = require("@cucumber/messages");
var gherkin_1 = require("@cucumber/gherkin");
var node_fs_1 = require("node:fs");
var line_js_1 = require("./line.js");
var Document = /** @class */ (function () {
    function Document(filePath) {
        var _this = this;
        this.feature = new messages_1.Feature();
        // Sometimes, we need access to the raw lines since Gherkin has processing
        // to trim line content in the AST
        this.lines = [];
        this.errors = [];
        // If true, this document has rule validation disabled
        this.disabled = false;
        // A list of lines that are disabled by the gherklin-disable-next-line comment
        // Uses a map of line number => array of rules to disable
        this.linesDisabled = new Map();
        // A list of rules that are disabled by the gherklin-disable rule-name comment
        this.rulesDisabled = new Map();
        this.load = function () { return __awaiter(_this, void 0, void 0, function () {
            var content, rawLines;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, promises_1.default.readFile(this.path).catch(function () {
                            throw new Error("Could not open the feature file at \"".concat(_this.filename, "\". Does it exist?"));
                        })];
                    case 1:
                        content = _a.sent();
                        this.parseGherkin(String(content));
                        if (!this.gherkinDocument) {
                            return [2 /*return*/];
                        }
                        rawLines = String(content).split(/\r\n|\r|\n/);
                        rawLines.forEach(function (line) {
                            _this.lines.push(new line_js_1.default(line));
                        });
                        this.getDisabledRules();
                        return [2 /*return*/];
                }
            });
        }); };
        this.parseGherkin = function (content) {
            var builder = new gherkin_1.default.AstBuilder(messages_1.IdGenerator.uuid());
            var matcher = new gherkin_1.default.GherkinClassicTokenMatcher();
            var parser = new gherkin_1.default.Parser(builder, matcher);
            _this.gherkinDocument = parser.parse(content.toString());
            if (_this.gherkinDocument.feature) {
                _this.feature = _this.gherkinDocument.feature;
            }
        };
        this.addError = function (rule, message, location) {
            // Don't add the error if the line has been disabled
            var disabledLine = _this.linesDisabled.get(location.line);
            if (disabledLine) {
                // If the array is empty, we disable all rules
                if (disabledLine.length === 0) {
                    return;
                }
                // Specific rule disabled for next line
                if (disabledLine.includes(rule.name)) {
                    return;
                }
            }
            // Don't add the error if the rule is disabled via
            // # gherklin-disable rule-name
            if (_this.rulesDisabled.get(rule.name) === true) {
                return;
            }
            _this.errors.push({
                message: message,
                location: location,
                severity: rule.schema.severity,
                rule: rule.name,
            });
        };
        this.getDisabledRules = function () {
            var _a, _b;
            // Guard in case comments are not present
            (_b = (_a = _this.gherkinDocument) === null || _a === void 0 ? void 0 : _a.comments) === null || _b === void 0 ? void 0 : _b.forEach(function (comment) {
                var _a;
                var text = comment.text.trim();
                if (comment.location.line === 1) {
                    if (text === '# gherklin-disable') {
                        _this.disabled = true;
                        return;
                    }
                    var disableRuleMatch = text.match(/^# gherklin-disable ([a-zA-Z0-9-,\s]+)$/);
                    if (disableRuleMatch) {
                        var rules = (disableRuleMatch[1] || '').split(',');
                        rules.forEach(function (rule) {
                            _this.rulesDisabled.set(rule.trim(), true);
                        });
                    }
                }
                var disableNextLineMatches = text.match(/#\sgherklin-disable-next-line\s?([a-zA-Z0-9-,\s]+)?/);
                if (disableNextLineMatches && disableNextLineMatches.length) {
                    var specificRules = disableNextLineMatches[1];
                    _this.linesDisabled.set(comment.location.line + 1, (_a = specificRules === null || specificRules === void 0 ? void 0 : specificRules.split(',').map(function (r) { return r.trim(); })) !== null && _a !== void 0 ? _a : []);
                }
            });
        };
        /**
         * Regenerates the file from the lines array, overwriting the existing file
         */
        this.regenerate = function () { return __awaiter(_this, void 0, void 0, function () {
            var lines, content;
            return __generator(this, function (_a) {
                lines = [];
                this.lines.forEach(function (l) {
                    var padding = [];
                    if (l.indentation > 0) {
                        padding = Array(Number(l.indentation)).fill(' ');
                    }
                    lines.push(padding.join('') + l.keyword + l.text);
                });
                content = lines.join('\n');
                (0, node_fs_1.writeFileSync)(this.path, content);
                // Need to regenerate the Gherkin AST since some rules rely on that
                this.parseGherkin(content);
                return [2 /*return*/];
            });
        }); };
        this.filename = node_path_1.default.basename(filePath);
        this.path = filePath;
    }
    return Document;
}());
exports.default = Document;
