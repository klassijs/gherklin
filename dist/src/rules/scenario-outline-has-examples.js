import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class ScenarioOutlineHasExamples {
    name = 'scenario-outline-has-examples';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.feature.children.forEach((child) => {
            if (!child.scenario)
                return;
            if (child.scenario.keyword !== 'Scenario Outline')
                return;
            const examples = child.scenario.examples;
            if (!examples || examples.length === 0) {
                document.addError(this, 'Scenario Outline must have at least one Examples block.', child.scenario.location);
            }
        });
    }
}
//# sourceMappingURL=scenario-outline-has-examples.js.map