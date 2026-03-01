import { offOrStringArrayOrSeverityAndStringArray } from '../schemas.js';
import Schema from '../schema.js';
export default class AllowedTags {
    name = 'allowed-tags';
    acceptedSchema = offOrStringArrayOrSeverityAndStringArray;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        let allowedTags = this.schema.args;
        if (!allowedTags.length) {
            return;
        }
        document.feature.tags.forEach((tag) => {
            if (!allowedTags.includes(tag.name)) {
                document.addError(this, `Found a feature tag that is not allowed. Got ${tag.name}, wanted ${Array.isArray(allowedTags) ? allowedTags.join(', ') : allowedTags}`, tag.location);
            }
        });
        document.feature.children.forEach((child) => {
            if (!child.scenario) {
                return;
            }
            child.scenario.tags.forEach((tag) => {
                if (!allowedTags.includes(tag.name)) {
                    document.addError(this, `Found a scenario tag that is not allowed. Got ${tag.name}, wanted ${Array.isArray(allowedTags) ? allowedTags.join(', ') : allowedTags}`, tag.location);
                }
            });
        });
    }
}
//# sourceMappingURL=allowed-tags.js.map