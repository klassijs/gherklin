import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class FilenameKebabCase {
    name = 'filename-kebab-case';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        if (!/^[^_|\s]+(?=-?)[^_|\s]+.feature$/.test(document.filename)) {
            document.addError(this, `File names should be kebab-case. Got "${document.filename}".`, {
                line: 1,
                column: 1,
            });
            return;
        }
        if (document.filename !== document.filename.toLowerCase()) {
            document.addError(this, `File names should be kebab-case. Got "${document.filename}".`, {
                line: 1,
                column: 1,
            });
        }
    }
}
