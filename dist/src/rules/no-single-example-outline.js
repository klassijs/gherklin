import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoSingleExampleOutline {
    name = 'no-single-example-outline';
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
            if (child.scenario.keyword !== 'Scenario Outline') {
                return;
            }
            if (!child.scenario.examples.length) {
                return;
            }
            let totalExamples = 0;
            child.scenario.examples.forEach((example) => {
                totalExamples += example.tableBody.length;
            });
            if (totalExamples === 1) {
                document.addError(this, 'Scenario Outline has only one example. Consider converting to a simple Scenario.', child.scenario.location);
            }
        });
    }
}
