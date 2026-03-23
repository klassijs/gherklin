import { switchOrSeverityorSeverityAndStringSchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoTypographerQuotes {
    name = 'no-typographer-quotes';
    acceptedSchema = switchOrSeverityorSeverityAndStringSchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const quotes = ['“', '”', '‘', '’'];
        document.lines.forEach((line, index) => {
            quotes.forEach((quote) => {
                if (line.text.includes(quote)) {
                    document.addError(this, 'Found typographer quote', {
                        line: index + 1,
                        column: line.indentation + line.keyword.length + (line.text.indexOf(quote) + 1),
                    });
                }
            });
        });
    }
    async fix(document) {
        let replacer = `'`;
        if (this.schema.args) {
            replacer = this.schema.args;
        }
        document.lines.forEach((line, index) => {
            const quotes = ['“', '”', '‘', '’'];
            quotes.forEach((quote) => {
                document.lines[index].text = line.text.replaceAll(quote, replacer);
            });
        });
        await document.regenerate();
    }
}
//# sourceMappingURL=no-typographer-quotes.js.map