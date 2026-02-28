import { switchOrSeverityorSeverityAndStringSchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema, Location } from '../types.js'
import Document from '../document.js'
import Line from '../line.js'

export default class NoInconsistentQuotes implements Rule {
    public readonly name: string = 'no-inconsistent-quotes'
    public readonly acceptedSchema: AcceptedSchema = switchOrSeverityorSeverityAndStringSchema
    public readonly schema: Schema

    public constructor(rawSchema: RawSchema) {
        this.schema = new Schema(rawSchema)
    }

    public async run(document: Document): Promise<void> {
        const quotesUsed: Map<string, Location[]> = new Map()
        quotesUsed.set(`"`, [])
        quotesUsed.set(`'`, [])

        document.lines.forEach((line: Line, index: number): void => {
            const singleIndex = line.text.indexOf(`'`)
            if (singleIndex > -1) {
                const prev = quotesUsed.get(`'`) ?? []
                quotesUsed.set(`'`, [
                    ...prev,
                    {
                        line: index + 1,
                        column: line.indentation + line.keyword.length + singleIndex + 1,
                    },
                ])
            }

            const doubleIndex = line.text.indexOf(`"`)
            if (doubleIndex > -1) {
                const prev = quotesUsed.get(`"`) ?? []
                quotesUsed.set(`"`, [
                    ...prev,
                    {
                        line: index + 1,
                        column: line.indentation + line.keyword.length + doubleIndex + 1,
                    },
                ])
            }
        })

        const singles = quotesUsed.get(`'`) ?? []
        const doubles = quotesUsed.get(`"`) ?? []

        if (singles.length > 0 && doubles.length > 0) {
            quotesUsed.forEach((locations: Location[]) => {
                locations.forEach((location: Location): void => {
                    document.addError(this, 'Found a mix of single and double quotes.', location)
                })
            })
        }
    }

    public async fix(document: Document): Promise<void> {
        const arg: unknown = this.schema.args;

        const isNonEmptyString = (v: unknown): v is string =>
            typeof v === 'string' && v.length > 0;

        const replacer: string = isNonEmptyString(arg) ? arg : `'`;

        document.lines.forEach((line: Line, index: number): void => {
            document.lines[index].text = line.text.replaceAll(/['"]/g, replacer);
        });

        await document.regenerate();
    }
}
