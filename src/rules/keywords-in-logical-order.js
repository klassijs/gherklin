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
var gherkin_1 = require("@cucumber/gherkin");
var schemas_js_1 = require("../schemas.js");
var schema_js_1 = require("../schema.js");
var KeywordsInLogicalOrder = /** @class */ (function () {
    function KeywordsInLogicalOrder(rawSchema) {
        this.name = 'keywords-in-logical-order';
        this.acceptedSchema = schemas_js_1.switchOrSeveritySchema;
        this.schema = new schema_js_1.default(rawSchema);
    }
    KeywordsInLogicalOrder.prototype.run = function (document) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                document.feature.children.forEach(function (child) {
                    var _a;
                    if (!child.scenario)
                        return;
                    // ----- Dialect lookup with safe fallback -----
                    // dialects is a record of language -> keyword arrays (strings with trailing spaces, e.g., 'Given ')
                    var lang = document.feature.language;
                    var dialect = (_a = gherkin_1.dialects[lang]) !== null && _a !== void 0 ? _a : gherkin_1.dialects.en;
                    // Explicitly coerce to string[] and filter out the '*' wildcard variant
                    var given = dialect.given.filter(function (w) { return w !== '* '; });
                    var when = dialect.when.filter(function (w) { return w !== '* '; });
                    var then = dialect.then.filter(function (w) { return w !== '* '; });
                    var and = dialect.and.filter(function (w) { return w !== '* '; });
                    var but = dialect.but.filter(function (w) { return w !== '* '; });
                    // Pre-trimmed sets for error messages
                    var trimmedWhen = when.map(function (w) { return w.trim(); });
                    var trimmedThen = then.map(function (w) { return w.trim(); });
                    var trimmedAnd = and.map(function (w) { return w.trim(); });
                    var trimmedBut = but.map(function (w) { return w.trim(); });
                    child.scenario.steps.forEach(function (step, index) {
                        var nextStep = child.scenario.steps[index + 1];
                        if (!nextStep)
                            return;
                        var stepKw = step.keyword; // e.g., 'Given ', 'When ', 'Then ', 'And ', 'But '
                        var nextKw = nextStep.keyword;
                        var nextTrimmed = nextKw.trim();
                        // Given must be followed by When/And/But
                        if (given.includes(stepKw) && !__spreadArray(__spreadArray(__spreadArray([], and, true), but, true), when, true).includes(nextKw)) {
                            document.addError(_this, "Expected \"".concat(stepKw.trim(), "\" to be followed by \"").concat(__spreadArray(__spreadArray(__spreadArray([], trimmedAnd, true), trimmedBut, true), trimmedWhen, true).join(', '), "\", got \"").concat(nextTrimmed, "\""), step.location);
                        }
                        // When must be followed by Then/And/But
                        if (when.includes(stepKw) && !__spreadArray(__spreadArray(__spreadArray([], and, true), but, true), then, true).includes(nextKw)) {
                            document.addError(_this, "Expected \"".concat(stepKw.trim(), "\" to be followed by \"").concat(__spreadArray(__spreadArray(__spreadArray([], trimmedAnd, true), trimmedBut, true), trimmedThen, true).join(', '), "\", got \"").concat(nextTrimmed, "\""), step.location);
                        }
                        // Then must be followed by And/When
                        if (then.includes(stepKw) && !__spreadArray(__spreadArray([], and, true), when, true).includes(nextKw)) {
                            document.addError(_this, "Expected \"".concat(stepKw.trim(), "\" to be followed by \"").concat(__spreadArray(__spreadArray([], trimmedAnd, true), trimmedWhen, true).join(', '), "\", got \"").concat(nextTrimmed, "\""), step.location);
                        }
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    return KeywordsInLogicalOrder;
}());
exports.default = KeywordsInLogicalOrder;
