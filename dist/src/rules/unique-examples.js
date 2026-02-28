import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class UniqueExamples {
    name = 'unique-examples';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.feature.children.forEach((child) => {
            // Only applies to scenarios
            if (!child.scenario)
                return;
            // Only applies to "Scenario Outline"
            if (child.scenario.keyword !== 'Scenario Outline')
                return;
            const examples = child.scenario.examples ?? [];
            if (examples.length === 0)
                return;
            const names = [];
            examples.forEach((e) => {
                const name = e.name ?? ''; // normalize to string for dedupe
                if (!names.includes(name)) {
                    names.push(name);
                    return;
                }
                // Duplicate example name detected
                document.addError(this, 'Examples should contain a unique name if there are more than one.', e.location);
            });
        });
    }
}
