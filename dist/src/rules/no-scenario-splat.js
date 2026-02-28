import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoScenarioSplat {
    name = 'no-scenario-splat';
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
            child.scenario.steps.forEach((step) => {
                if (step.keyword.trim() === '*') {
                    document.addError(this, 'Found a splat (*) inside a scenario.', step.location);
                }
            });
        });
    }
}
