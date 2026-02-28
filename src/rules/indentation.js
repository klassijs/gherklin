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
var schemas_js_1 = require("../schemas.js");
var schema_js_1 = require("../schema.js");
var Indentation = /** @class */ (function () {
    function Indentation(rawSchema) {
        this.name = 'indentation';
        this.acceptedSchema = schemas_js_1.offOrKeywordIntsOrSeverityAndKeywordInts;
        this.schema = new schema_js_1.default(rawSchema);
    }
    Indentation.prototype.run = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var args, numArg, firstTagCol, col;
            var _this = this;
            return __generator(this, function (_a) {
                args = this.schema.args;
                if (!args)
                    return [2 /*return*/];
                numArg = function (key) {
                    return args[key];
                };
                // ----- Feature-level checks -----
                if (args.featureTag !== undefined && document.feature.tags.length) {
                    firstTagCol = document.feature.tags[0].location.column;
                    if (firstTagCol !== args.featureTag) {
                        document.addError(this, "Invalid indentation for feature tags. Got ".concat(firstTagCol, ", wanted ").concat(args.featureTag), document.feature.tags[0].location);
                    }
                }
                if (args.feature !== undefined) {
                    col = document.feature.location.column;
                    if (col !== args.feature) {
                        document.addError(this, "Invalid indentation for feature. Got ".concat(col, ", wanted ").concat(args.feature), document.feature.location);
                    }
                }
                // ----- Children (Backgrounds / Scenarios) -----
                document.feature.children.forEach(function (child) {
                    var _a;
                    // Background block
                    if (child.background && args.background !== undefined) {
                        var bgCol = child.background.location.column;
                        if (bgCol !== args.background) {
                            document.addError(_this, "Invalid indentation for background. Got ".concat(bgCol, ", wanted ").concat(args.background), child.background.location);
                        }
                    }
                    // Scenario (or Scenario Outline)
                    if (child.scenario) {
                        var scenarioType = child.scenario.keyword === 'Scenario Outline'
                            ? 'scenarioOutline'
                            : 'scenario';
                        var expectedScenario = numArg(scenarioType);
                        if (expectedScenario !== undefined) {
                            var col = child.scenario.location.column;
                            if (col !== expectedScenario) {
                                document.addError(_this, "Invalid indentation for ".concat(scenarioType, ". Got ").concat(col, ", wanted ").concat(expectedScenario), child.scenario.location);
                            }
                        }
                        if (args.scenarioTag !== undefined && child.scenario.tags.length) {
                            var tagCol = child.scenario.tags[0].location.column;
                            if (tagCol !== args.scenarioTag) {
                                document.addError(_this, "Invalid indentation for ".concat(scenarioType, " tags. Got ").concat(tagCol, ", wanted ").concat(args.scenarioTag), child.scenario.tags[0].location);
                            }
                        }
                    }
                    // Background steps
                    if (child.background) {
                        child.background.steps.forEach(function (step) {
                            var key = step.keyword.toLowerCase();
                            var expected = numArg(key);
                            if (expected !== undefined) {
                                if (step.location.column !== expected) {
                                    document.addError(_this, "Invalid indentation for ".concat(key, ". Got ").concat(step.location.column, ", wanted ").concat(expected), step.location);
                                }
                            }
                        });
                    }
                    // Scenario / Outline steps + examples
                    if (child.scenario) {
                        child.scenario.steps.forEach(function (step) {
                            var stepNormalized = step.keyword.toLowerCase().trimEnd();
                            var expected = numArg(stepNormalized);
                            if (expected !== undefined) {
                                if (step.location.column !== expected) {
                                    document.addError(_this, "Invalid indentation for ".concat(stepNormalized, ". Got ").concat(step.location.column, ", wanted ").concat(expected), step.location);
                                }
                            }
                            if (step.dataTable && args.dataTable !== undefined) {
                                var dtCol = step.dataTable.location.column;
                                if (dtCol !== args.dataTable) {
                                    document.addError(_this, "Invalid indentation for ".concat(stepNormalized, " data table. Got ").concat(dtCol, ", wanted ").concat(args.dataTable), step.dataTable.location);
                                }
                            }
                        });
                        // Examples (Scenario Outline only)
                        (_a = child.scenario.examples) === null || _a === void 0 ? void 0 : _a.forEach(function (example) {
                            if (example.tableHeader && args.exampleTableHeader !== undefined) {
                                var hdrCol = example.tableHeader.location.column;
                                if (hdrCol !== args.exampleTableHeader) {
                                    document.addError(_this, "Invalid indentation for example table header. Got ".concat(hdrCol, ", wanted ").concat(args.exampleTableHeader), example.tableHeader.location);
                                }
                            }
                            if (example.tableBody && args.exampleTableBody !== undefined) {
                                example.tableBody.forEach(function (row) {
                                    var rowCol = row.location.column;
                                    if (rowCol !== args.exampleTableBody) {
                                        document.addError(_this, "Invalid indentation for example table row. Got ".concat(rowCol, ", wanted ").concat(args.exampleTableBody), row.location);
                                    }
                                });
                            }
                        });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    Indentation.prototype.fix = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var expectedIndentation, numArg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedIndentation = this.schema.args;
                        numArg = function (key) {
                            return expectedIndentation[key];
                        };
                        document.lines.forEach(function (line, index) {
                            var expected = numArg(line.safeKeyword);
                            if (typeof expected === 'number') {
                                // lines store indentation as "count of spaces before keyword",
                                // expected is a 1-based "column"; subtract 1 to get indentation.
                                document.lines[index].indentation = expected - 1;
                            }
                        });
                        return [4 /*yield*/, document.regenerate()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Indentation;
}());
exports.default = Indentation;
