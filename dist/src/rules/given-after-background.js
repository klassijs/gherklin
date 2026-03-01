import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class GivenAfterBackground {
    name = 'given-after-background';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const backgrounds = document.feature.children.filter((child) => child.background !== undefined);
        if (!backgrounds.length) {
            return;
        }
        document.feature.children.forEach((child) => {
            if (!child.scenario) {
                return;
            }
            child.scenario.steps.forEach((step) => {
                if (step.keyword.trim() === 'Given') {
                    document.addError(this, 'Found "Given" in scenario when background exists.', step.location);
                }
            });
        });
    }
}
//# sourceMappingURL=given-after-background.js.map