import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class OneFeaturePerFile {
    name = 'one-feature-per-file';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const featureLineIndices = [];
        document.lines.forEach((line, index) => {
            const kw = (line.keyword ?? '').trim();
            if (kw === 'Feature') {
                featureLineIndices.push(index + 1);
            }
        });
        if (featureLineIndices.length > 1) {
            document.addError(this, `File must contain at most one Feature. Found ${featureLineIndices.length}.`, { line: featureLineIndices[1], column: 1 });
        }
    }
}
//# sourceMappingURL=one-feature-per-file.js.map