import { offOrNumberOrSeverityAndNumber } from '../schemas.js';
import Schema from '../schema.js';
export default class MaxScenarios {
    name = 'max-scenarios';
    acceptedSchema = offOrNumberOrSeverityAndNumber;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        let scenarioCount = 0;
        document.feature.children.forEach((child) => {
            if (child.scenario) {
                scenarioCount += 1;
            }
        });
        const expected = this.schema.args;
        if (scenarioCount > expected) {
            document.addError(this, `Expected max ${expected} scenarios per file. Found ${scenarioCount}.`, document.feature.location);
        }
    }
}
//# sourceMappingURL=max-scenarios.js.map