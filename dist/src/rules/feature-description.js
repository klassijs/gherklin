import { offOrNumberOrSeverityAndNumber } from '../schemas.js';
import Schema from '../schema.js';
const DEFAULT_MIN_LENGTH = 40;
export default class FeatureDescription {
    name = 'feature-description';
    acceptedSchema = offOrNumberOrSeverityAndNumber;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        if (!document.feature)
            return;
        const minLength = this.schema.args !== undefined ? Number(this.schema.args) : DEFAULT_MIN_LENGTH;
        const description = document.feature.description;
        const trimmed = description != null && typeof description === 'string'
            ? description.trim()
            : '';
        if (trimmed.length === 0) {
            document.addError(this, 'Feature is missing a description.', document.feature.location);
            return;
        }
        if (trimmed.length < minLength) {
            document.addError(this, `Feature description is too short. Expected at least ${minLength} characters, got ${trimmed.length}.`, document.feature.location);
        }
    }
}
//# sourceMappingURL=feature-description.js.map