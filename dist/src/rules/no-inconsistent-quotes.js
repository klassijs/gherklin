import { switchOrSeverityorSeverityAndStringSchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoInconsistentQuotes {
    name = 'no-inconsistent-quotes';
    acceptedSchema = switchOrSeverityorSeverityAndStringSchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const quotesUsed = new Map();
        quotesUsed.set(`"`, []);
        quotesUsed.set(`'`, []);
        document.lines.forEach((line, index) => {
            const singleIndex = line.text.indexOf(`'`);
            if (singleIndex > -1) {
                const prev = quotesUsed.get(`'`) ?? [];
                quotesUsed.set(`'`, [
                    ...prev,
                    {
                        line: index + 1,
                        column: line.indentation + line.keyword.length + singleIndex + 1,
                    },
                ]);
            }
            const doubleIndex = line.text.indexOf(`"`);
            if (doubleIndex > -1) {
                const prev = quotesUsed.get(`"`) ?? [];
                quotesUsed.set(`"`, [
                    ...prev,
                    {
                        line: index + 1,
                        column: line.indentation + line.keyword.length + doubleIndex + 1,
                    },
                ]);
            }
        });
        const singles = quotesUsed.get(`'`) ?? [];
        const doubles = quotesUsed.get(`"`) ?? [];
        if (singles.length > 0 && doubles.length > 0) {
            quotesUsed.forEach((locations) => {
                locations.forEach((location) => {
                    document.addError(this, 'Found a mix of single and double quotes.', location);
                });
            });
        }
    }
    async fix(document) {
        const arg = this.schema.args;
        const isNonEmptyString = (v) => typeof v === 'string' && v.length > 0;
        const replacer = isNonEmptyString(arg) ? arg : `'`;
        document.lines.forEach((line, index) => {
            document.lines[index].text = line.text.replaceAll(/['"]/g, replacer);
        });
        await document.regenerate();
    }
}
