import { offOrNumberOrSeverityAndNumber } from '../schemas.js';
import Schema from '../schema.js';
export default class FeatureNameLength {
    name = 'feature-name-length';
    acceptedSchema = offOrNumberOrSeverityAndNumber;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const maxLength = this.schema.args !== undefined ? Number(this.schema.args) : 100;
        const name = (document.feature.name ?? '').trim();
        if (name.length > maxLength) {
            document.addError(this, `Feature name is too long. Expected max ${maxLength}, got ${name.length}.`, document.feature.location);
        }
    }
}
//# sourceMappingURL=feature-name-length.js.map