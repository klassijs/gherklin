import { Severity, Switch } from './types.js';
export default class Schema {
    rawSchema;
    severity = Severity.warn;
    args;
    enabled = true;
    constructor(rawSchema) {
        this.rawSchema = rawSchema;
        this.parse();
    }
    parse() {
        // If it's a string, it's a severity or switch
        if (typeof this.rawSchema === 'string') {
            if ([Severity.error.toString(), Severity.warn.toString()].includes(this.rawSchema)) {
                this.severity = this.rawSchema;
            }
            else {
                this.enabled = this.rawSchema === Switch.on;
            }
            return;
        }
        if (Array.isArray(this.rawSchema)) {
            if ([Severity.warn, Severity.error, Switch.on, Switch.off].includes(this.rawSchema[0])) {
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
    }
    validate(zodSchema) {
        const result = zodSchema.safeParse(this.rawSchema);
        if (!result.success) {
            return result.error.format()?._errors;
        }
        return [];
    }
}
//# sourceMappingURL=schema.js.map