import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoDuplicateSteps {
    name = 'no-duplicate-steps';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const checkSteps = (steps) => {
            const seen = new Set();
            for (const step of steps) {
                const key = `${step.keyword.trim()}|${step.text.trim()}`;
                if (seen.has(key)) {
                    document.addError(this, `Duplicate step in same scenario: "${step.keyword.trim()} ${step.text.trim()}".`, step.location);
                }
                seen.add(key);
            }
        };
        document.feature.children.forEach((child) => {
            if (child.background?.steps?.length) {
                checkSteps(child.background.steps);
            }
            if (child.scenario?.steps?.length) {
                checkSteps(child.scenario.steps);
            }
        });
    }
}
//# sourceMappingURL=no-duplicate-steps.js.map