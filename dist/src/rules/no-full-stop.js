import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoFullStop {
    name = 'no-full-stop';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.lines.forEach((line, index) => {
            const trimmed = line.text.trimEnd();
            if (trimmed[trimmed.length - 1] === '.') {
                document.addError(this, `Line ends with a full stop.`, {
                    line: index + 1,
                    column: (line.keyword + trimmed).length,
                });
            }
        });
    }
    async fix(document) {
        document.lines.forEach((line, index) => {
            const trimmed = line.text.trimEnd();
            if (trimmed[trimmed.length - 1] === '.') {
                document.lines[index].text = trimmed.substring(0, trimmed.length - 1);
            }
        });
        await document.regenerate();
    }
}
//# sourceMappingURL=no-full-stop.js.map