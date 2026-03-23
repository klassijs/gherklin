import { offOrNumberOrSeverityAndNumber } from '../schemas.js';
import Schema from '../schema.js';
export default class MaxBackgroundSteps {
    name = 'max-background-steps';
    acceptedSchema = offOrNumberOrSeverityAndNumber;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const maxSteps = this.schema.args;
        if (typeof maxSteps !== 'number' || maxSteps < 0)
            return;
        document.feature.children.forEach((child) => {
            if (!child.background?.steps?.length)
                return;
            const count = child.background.steps.length;
            if (count > maxSteps) {
                document.addError(this, `Background has ${count} steps. Maximum allowed is ${maxSteps}.`, child.background.location);
            }
        });
    }
}
//# sourceMappingURL=max-background-steps.js.map