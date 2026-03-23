import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class ScenarioAction {
    name = 'scenario-action';
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
            const whens = child.scenario.steps.filter((s) => s.keyword.trim() === 'When');
            if (whens.length === 0) {
                document.addError(this, 'Scenario should contain a "When" to denote an action.', child.scenario.location);
            }
        });
    }
}
//# sourceMappingURL=scenario-action.js.map