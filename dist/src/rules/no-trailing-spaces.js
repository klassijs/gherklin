import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
import Line from '../line.js';
export default class NoTrailingSpaces {
    name = 'no-trailing-spaces';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        let lineNumber = 1;
        document.lines.forEach((line) => {
            const joined = `${line.keyword}${line.text}`;
            if (joined.charCodeAt(joined.length - 1) === 32) {
                document.addError(this, 'Found trailing whitespace.', {
                    line: lineNumber,
                    column: joined.length,
                });
            }
            lineNumber += 1;
        });
    }
    async fix(document) {
        document.lines.forEach((line, index) => {
            const joined = `${line.keyword}${line.text.trimEnd()}`;
            document.lines[index] = new Line(joined);
        });
        await document.regenerate();
    }
}
