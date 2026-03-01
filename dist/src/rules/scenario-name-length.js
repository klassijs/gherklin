import { offOrNumberOrSeverityAndNumber } from '../schemas.js';
import Schema from '../schema.js';
export default class ScenarioNameLength {
    name = 'scenario-name-length';
    acceptedSchema = offOrNumberOrSeverityAndNumber;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.feature.children.forEach((child) => {
            if (!child.scenario) {
                return;
            }
            let maxLength = 100;
            if (this.schema.args) {
                maxLength = Number(this.schema.args);
            }
            if (child.scenario.name.length > maxLength) {
                document.addError(this, `Scenario name is too long. Expected max ${maxLength}, got ${child.scenario.name.length}.`, child.scenario.location);
            }
        });
    }
}
//# sourceMappingURL=scenario-name-length.js.map