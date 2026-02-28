import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class FilenameSnakeCase {
    name = 'filename-snake-case';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        if (!/^\w+.feature$/.test(document.filename)) {
            document.addError(this, `File names should be snake_case. Got "${document.filename}".`, {
                line: 1,
                column: 1,
            });
        }
        if (document.filename !== document.filename.toLowerCase()) {
            document.addError(this, `File names should be snake_case. Got "${document.filename}".`, {
                line: 1,
                column: 1,
            });
        }
    }
}
