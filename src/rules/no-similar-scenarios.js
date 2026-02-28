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
var utils_js_1 = require("../utils.js");
var NoSimilarScenarios = /** @class */ (function () {
    function NoSimilarScenarios(rawSchema) {
        this.name = 'no-similar-scenarios';
        this.acceptedSchema = schemas_js_1.offOrNumberOrSeverityOrSeverityAndNumber;
        this.defaultThreshold = 80;
        this.schema = new schema_js_1.default(rawSchema);
    }
    NoSimilarScenarios.prototype.run = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var resolvedThreshold;
            var _this = this;
            return __generator(this, function (_a) {
                resolvedThreshold = (typeof this.schema.args === 'number' ? this.schema.args : this.defaultThreshold);
                document.feature.children.forEach(function (child) {
                    if (!child.scenario)
                        return;
                    // Capture the scenario to preserve the type‑narrowing throughout
                    var scenario = child.scenario;
                    var thisSteps = scenario.steps;
                    // Build a list of the *other* scenarios (exclude current)
                    var otherScenarios = document.feature.children
                        .map(function (c) { return c.scenario; })
                        .filter(function (s) { return Boolean(s && s.id !== scenario.id); });
                    // Compare current scenario against each "other"
                    otherScenarios.forEach(function (other) {
                        // Compute Levenshtein totals for this pair only
                        var pairLevTotal = 0;
                        var pairMaxPossible = 0;
                        thisSteps.forEach(function (step, i) {
                            var nextStep = other.steps[i];
                            if (!nextStep)
                                return;
                            var left = "".concat(step.keyword).concat(step.text);
                            var right = "".concat(nextStep.keyword).concat(nextStep.text);
                            pairMaxPossible += left.length + right.length;
                            pairLevTotal += (0, utils_js_1.levenshtein)(left, right);
                        });
                        // Avoid divide-by-zero if no comparable steps
                        if (pairMaxPossible === 0)
                            return;
                        var percentage = 100 - (pairLevTotal / pairMaxPossible) * 100;
                        if (percentage > resolvedThreshold) {
                            document.addError(_this, "Scenario \"".concat(scenario.name, "\" is too similar (> ").concat(resolvedThreshold, "%) to scenario \"").concat(other.name, "\"."), scenario.location);
                        }
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    return NoSimilarScenarios;
}());
exports.default = NoSimilarScenarios;
