import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoEmptyScenario {
    name = 'no-empty-scenario';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.feature.children.forEach((child) => {
            if (!child.scenario)
                return;
            const steps = child.scenario.steps ?? [];
            if (steps.length === 0) {
                document.addError(this, 'Scenario must have at least one step.', child.scenario.location);
            }
        });
    }
}
//# sourceMappingURL=no-empty-scenario.js.map