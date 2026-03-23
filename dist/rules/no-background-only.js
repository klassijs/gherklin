import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoBackgroundOnly {
    name = 'no-background-only';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.feature.children.forEach((child) => {
            if (!child.background) {
                return;
            }
            if (document.feature.children.length < 2) {
                document.addError(this, `File contains only a background.`, document.feature.location);
            }
        });
    }
}
//# sourceMappingURL=no-background-only.js.map