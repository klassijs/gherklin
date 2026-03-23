import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class FilenameCamelCase {
    name = 'filename-camel-case';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        if (!/^[a-z][a-zA-Z0-9]*\.feature$/.test(document.filename)) {
            document.addError(this, `File names should be camelCase. Got "${document.filename}".`, {
                line: 1,
                column: 1,
            });
        }
    }
}
//# sourceMappingURL=filename-camel-case.js.map