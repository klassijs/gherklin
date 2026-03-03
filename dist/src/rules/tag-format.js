import { switchOrSeverityorSeverityAndStringSchema } from '../schemas.js';
import Schema from '../schema.js';
export default class TagFormat {
    name = 'tag-format';
    acceptedSchema = switchOrSeverityorSeverityAndStringSchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const patternSource = this.schema.args;
        if (typeof patternSource !== 'string' || !patternSource)
            return;
        let re;
        try {
            re = new RegExp(patternSource);
        }
        catch {
            return;
        }
        const checkTags = (tags) => {
            tags.forEach((tag) => {
                if (!re.test(tag.name)) {
                    document.addError(this, `Tag "${tag.name}" does not match required format: ${patternSource}`, tag.location);
                }
            });
        };
        if (document.feature.tags?.length) {
            checkTags(document.feature.tags);
        }
        document.feature.children.forEach((child) => {
            if (child.scenario?.tags?.length) {
                checkTags(child.scenario.tags);
            }
        });
    }
}
//# sourceMappingURL=tag-format.js.map