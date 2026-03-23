import { offOrNumberOrSeverityAndNumber } from '../schemas.js';
import Schema from '../schema.js';
export default class MaxStepsPerScenario {
    name = 'max-steps-per-scenario';
    acceptedSchema = offOrNumberOrSeverityAndNumber;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const maxSteps = this.schema.args;
        if (typeof maxSteps !== 'number' || maxSteps < 1)
            return;
        document.feature.children.forEach((child) => {
            if (child.scenario?.steps?.length) {
                const count = child.scenario.steps.length;
                if (count > maxSteps) {
                    document.addError(this, `Scenario has ${count} steps. Maximum allowed is ${maxSteps}.`, child.scenario.location);
                }
            }
        });
    }
}
//# sourceMappingURL=max-steps-per-scenario.js.map