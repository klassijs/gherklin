import { offOrStringArrayOrSeverityAndStringArray } from '../schemas.js';
import Schema from '../schema.js';
export default class RequiredTags {
    name = 'required-tags';
    acceptedSchema = offOrStringArrayOrSeverityAndStringArray;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const requiredTags = this.schema.args;
        if (!requiredTags?.length)
            return;
        document.feature.children.forEach((child) => {
            if (!child.scenario)
                return;
            const tagNames = child.scenario.tags?.map((t) => t.name) ?? [];
            const hasRequired = requiredTags.some((req) => tagNames.includes(req));
            if (!hasRequired) {
                document.addError(this, `Scenario must have at least one of the required tags: ${requiredTags.join(', ')}.`, child.scenario.location);
            }
        });
    }
}
//# sourceMappingURL=required-tags.js.map