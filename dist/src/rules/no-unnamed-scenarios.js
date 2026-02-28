import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoUnnamedScenarios {
    name = 'no-unnamed-scenarios';
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
            if (child.scenario.name.length === 0) {
                document.addError(this, 'Found scenario with no name.', child.scenario.location);
            }
        });
    }
}
