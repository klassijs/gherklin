import path from 'node:path';
import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoDupeFeatures {
    name = 'no-dupe-features';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    features = new Map();
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const featureName = document.feature.name;
        const currentFile = path.basename(document.filename);
        if (!this.features.has(featureName)) {
            // first time we see this featureName
            this.features.set(featureName, [currentFile]);
            return;
        }
        // Merge current file into existing list (dedupe just in case)
        const prev = this.features.get(featureName) ?? [];
        const next = [...prev, currentFile];
        this.features.set(featureName, next);
        // Report duplicates with a clear, joined list (sorted for deterministic output)
        const listed = [...next].sort().join(', ');
        document.addError(this, `Found duplicate feature "${featureName}" in "${listed}".`, document.feature.location);
    }
}
//# sourceMappingURL=no-dupe-features.js.map