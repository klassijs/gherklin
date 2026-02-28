import { offOrStringArrayOrSeverityAndStringArray } from '../schemas.js';
import Schema from '../schema.js';
export default class DisallowedTags {
    name = 'disallowed-tags';
    acceptedSchema = offOrStringArrayOrSeverityAndStringArray;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        let disallowedTags = this.schema.args;
        if (!disallowedTags.length) {
            return;
        }
        document.feature.tags.forEach((tag) => {
            if (disallowedTags.includes(tag.name)) {
                document.addError(this, `Found a feature tag that is not allowed. Got '${tag.name}'.`, tag.location);
            }
        });
        document.feature.children.forEach((child) => {
            if (!child.scenario) {
                return;
            }
            child.scenario.tags.forEach((tag) => {
                if (disallowedTags.includes(tag.name)) {
                    document.addError(this, `Found a scenario tag that is not allowed. Got '${tag.name}'.`, tag.location);
                }
            });
        });
    }
}
