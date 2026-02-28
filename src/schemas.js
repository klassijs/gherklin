"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offOrNumberOrSeverityOrSeverityAndNumber = exports.offOrNumberOrSeverityAndNumber = exports.offOrKeywordIntsOrSeverityAndKeywordInts = exports.offOrStringArrayOrSeverityAndStringArray = exports.switchOrSeverityorSeverityAndStringSchema = exports.switchOrSeveritySchema = exports.severitySchema = exports.keywordInts = void 0;
var zod_1 = require("zod");
var types_js_1 = require("./types.js");
exports.keywordInts = zod_1.z
    .object({
    feature: zod_1.z.number(),
    background: zod_1.z.number(),
    scenario: zod_1.z.number(),
    step: zod_1.z.number(),
    examples: zod_1.z.number(),
    given: zod_1.z.number(),
    when: zod_1.z.number(),
    then: zod_1.z.number(),
    and: zod_1.z.number(),
    but: zod_1.z.number(),
    exampleTableHeader: zod_1.z.number(),
    exampleTableBody: zod_1.z.number(),
    scenarioOutline: zod_1.z.number(),
    dataTable: zod_1.z.number(),
    featureTag: zod_1.z.number(),
    scenarioTag: zod_1.z.number(),
})
    .partial()
    .strict();
// warn | error
exports.severitySchema = zod_1.z.nativeEnum(types_js_1.Severity);
// on | off | warn | error
exports.switchOrSeveritySchema = zod_1.z.union([zod_1.z.nativeEnum(types_js_1.Switch), zod_1.z.nativeEnum(types_js_1.Severity)]);
exports.switchOrSeverityorSeverityAndStringSchema = zod_1.z.union([
    zod_1.z.nativeEnum(types_js_1.Switch),
    zod_1.z.nativeEnum(types_js_1.Severity),
    zod_1.z.tuple([zod_1.z.nativeEnum(types_js_1.Severity), zod_1.z.string()]),
]);
// off | on | error | warn | [error | warn, string]
exports.offOrStringArrayOrSeverityAndStringArray = zod_1.z.union([
    zod_1.z.literal(types_js_1.Switch.off),
    zod_1.z.string().array(),
    zod_1.z.tuple([exports.severitySchema, zod_1.z.string().array()]),
]);
//  off | keywordInts | [warn | error, keywordInts]
exports.offOrKeywordIntsOrSeverityAndKeywordInts = zod_1.z.union([
    zod_1.z.literal(types_js_1.Switch.off),
    exports.keywordInts,
    zod_1.z.tuple([zod_1.z.nativeEnum(types_js_1.Severity), exports.keywordInts]),
]);
exports.offOrNumberOrSeverityAndNumber = zod_1.z.union([
    zod_1.z.literal(types_js_1.Switch.off),
    zod_1.z.number(),
    zod_1.z.tuple([zod_1.z.nativeEnum(types_js_1.Severity), zod_1.z.number()]),
]);
exports.offOrNumberOrSeverityOrSeverityAndNumber = zod_1.z.union([
    zod_1.z.literal(types_js_1.Switch.off),
    zod_1.z.number(),
    zod_1.z.nativeEnum(types_js_1.Severity),
    zod_1.z.tuple([zod_1.z.nativeEnum(types_js_1.Severity), zod_1.z.number()]),
]);
