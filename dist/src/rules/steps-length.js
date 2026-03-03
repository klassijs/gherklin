import { offOrNumberOrSeverityAndNumber } from '../schemas.js';
import Schema from '../schema.js';
export default class StepsLength {
    name = 'steps-length';
    acceptedSchema = offOrNumberOrSeverityAndNumber;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        let maxLength = 80;
        if (this.schema.args !== undefined) {
            maxLength = Number(this.schema.args);
        }
        const checkStep = (step) => {
            const text = step.text ?? '';
            if (text.length > maxLength) {
                document.addError(this, `Step text is too long. Expected max ${maxLength}, got ${text.length}.`, step.location);
            }
        };
        document.feature.children.forEach((child) => {
            if (child.background?.steps) {
                child.background.steps.forEach(checkStep);
            }
            if (child.scenario?.steps) {
                child.scenario.steps.forEach(checkStep);
            }
        });
    }
}
//# sourceMappingURL=steps-length.js.map