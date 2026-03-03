import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
const GIVEN_WHEN_THEN = new Set(['given', 'when', 'then']);
function stepKeywordKey(keyword) {
    return keyword.trim().toLowerCase();
}
export default class NoAndButFirst {
    name = 'no-and-but-first';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.feature.children.forEach((child) => {
            if (child.background?.steps?.length) {
                const first = child.background.steps[0];
                const key = stepKeywordKey(first.keyword);
                if (!GIVEN_WHEN_THEN.has(key)) {
                    document.addError(this, 'First step in Background must be Given, When, or Then, not And or But.', first.location);
                }
            }
            if (child.scenario?.steps?.length) {
                const first = child.scenario.steps[0];
                const key = stepKeywordKey(first.keyword);
                if (!GIVEN_WHEN_THEN.has(key)) {
                    document.addError(this, 'First step in Scenario must be Given, When, or Then, not And or But.', first.location);
                }
            }
        });
    }
}
//# sourceMappingURL=no-and-but-first.js.map