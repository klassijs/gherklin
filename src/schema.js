"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_js_1 = require("./types.js");
var Schema = /** @class */ (function () {
    function Schema(rawSchema) {
        this.severity = types_js_1.Severity.warn;
        this.enabled = true;
        this.rawSchema = rawSchema;
        this.parse();
    }
    Schema.prototype.parse = function () {
        // If it's a string, it's a severity or switch
        if (typeof this.rawSchema === 'string') {
            if ([types_js_1.Severity.error.toString(), types_js_1.Severity.warn.toString()].includes(this.rawSchema)) {
                this.severity = this.rawSchema;
            }
            else {
                this.enabled = this.rawSchema === types_js_1.Switch.on;
            }
            return;
        }
        if (Array.isArray(this.rawSchema)) {
            if ([types_js_1.Severity.warn, types_js_1.Severity.error, types_js_1.Switch.on, types_js_1.Switch.off].includes(this.rawSchema[0])) {
                this.severity = this.rawSchema[0];
                this.args = this.rawSchema[1];
            }
            else {
                this.args = this.rawSchema;
            }
            return;
        }
        // There was no severity or switch, so it's all arguments
        this.args = this.rawSchema;
    };
    Schema.prototype.validate = function (zodSchema) {
        var _a;
        var result = zodSchema.safeParse(this.rawSchema);
        if (!result.success) {
            return (_a = result.error.format()) === null || _a === void 0 ? void 0 : _a._errors;
        }
        return [];
    };
    return Schema;
}());
exports.default = Schema;
