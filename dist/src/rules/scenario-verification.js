import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class ScenarioVerification {
    name = 'scenario-verification';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.feature.children.forEach((child) => {
            if (!child.scenario) {
                return;
            }
            const whens = child.scenario.steps.filter((s) => s.keyword.trim() === 'Then');
            if (whens.length === 0) {
                document.addError(this, 'Scenario should contain a "Then" to denote verification of an action.', child.scenario.location);
            }
        });
    }
}
//# sourceMappingURL=scenario-verification.js.map