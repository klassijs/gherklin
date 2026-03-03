import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
function isEmptyLine(line) {
    return (line.keyword + line.text).trim().length === 0;
}
export default class NoConsecutiveEmptyLines {
    name = 'no-consecutive-empty-lines';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        let prevEmpty = false;
        document.lines.forEach((line, index) => {
            const empty = isEmptyLine(line);
            if (empty && prevEmpty) {
                document.addError(this, 'Consecutive empty lines are not allowed.', {
                    line: index + 1,
                    column: 1,
                });
            }
            prevEmpty = empty;
        });
    }
    async fix(document) {
        const result = [];
        let prevEmpty = false;
        for (const line of document.lines) {
            const empty = isEmptyLine(line);
            if (empty && prevEmpty)
                continue;
            result.push(line);
            prevEmpty = empty;
        }
        document.lines.length = 0;
        document.lines.push(...result);
        await document.regenerate();
    }
}
//# sourceMappingURL=no-consecutive-empty-lines.js.map