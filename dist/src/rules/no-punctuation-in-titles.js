import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
const ENDS_WITH_PUNCT = /[.!?]$/;
export default class NoPunctuationInTitles {
    name = 'no-punctuation-in-titles';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const featureName = (document.feature.name ?? '').trim();
        if (ENDS_WITH_PUNCT.test(featureName)) {
            document.addError(this, 'Feature title must not end with punctuation (. ! ?).', document.feature.location);
        }
        document.feature.children.forEach((child) => {
            if (!child.scenario)
                return;
            const scenarioName = (child.scenario.name ?? '').trim();
            if (ENDS_WITH_PUNCT.test(scenarioName)) {
                document.addError(this, 'Scenario title must not end with punctuation (. ! ?).', child.scenario.location);
            }
        });
    }
}
//# sourceMappingURL=no-punctuation-in-titles.js.map