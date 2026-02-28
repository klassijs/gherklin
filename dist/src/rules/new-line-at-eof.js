import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
import Line from '../line.js';
export default class NewLineAtEof {
    name = 'new-line-at-eof';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const lines = document.lines;
        const lastLine = lines[lines.length - 1];
        if (lastLine.text !== '') {
            document.addError(this, 'No new line at end of file.', {
                line: lines.length,
                column: 0,
            });
        }
    }
    async fix(document) {
        document.lines.push(new Line(''));
        await document.regenerate();
    }
}
