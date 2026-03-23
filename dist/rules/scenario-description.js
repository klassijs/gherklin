import { offOrNumberOrSeverityAndNumber } from '../schemas.js';
import Schema from '../schema.js';
const DEFAULT_MIN_LENGTH = 40;
export default class ScenarioDescription {
    name = 'scenario-description';
    acceptedSchema = offOrNumberOrSeverityAndNumber;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        if (!document.feature)
            return;
        const minLength = this.schema.args !== undefined ? Number(this.schema.args) : DEFAULT_MIN_LENGTH;
        document.feature.children.forEach((child) => {
            if (!child.scenario)
                return;
            const description = child.scenario.description;
            const trimmed = description != null && typeof description === 'string'
                ? description.trim()
                : '';
            if (trimmed.length === 0) {
                document.addError(this, 'Scenario is missing a description.', child.scenario.location);
                return;
            }
            if (trimmed.length < minLength) {
                document.addError(this, `Scenario description is too short. Expected at least ${minLength} characters, got ${trimmed.length}.`, child.scenario.location);
            }
        });
    }
}
//# sourceMappingURL=scenario-description.js.map