import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class FeatureDescription {
    name = 'feature-description';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    defaultThreshold = 80;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        if (!document.feature.description) {
            document.addError(this, 'Feature is missing a description.', document.feature.location);
        }
    }
}
