import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoEmptyFile {
    name = 'no-empty-file';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        if (document.feature.keyword === '') {
            document.addError(this, 'Feature file is empty.', {
                line: 0,
                column: 0,
            });
        }
    }
}
//# sourceMappingURL=no-empty-file.js.map