import { switchOrSeverityorSeverityAndStringSchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'
import Line from '../line.js'

export default class NoTypographerQuotes implements Rule {
  public readonly name: string = 'no-typographer-quotes'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeverityorSeverityAndStringSchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const quotes = ['“', '”', '‘', '’']
    document.lines.forEach((line: Line, index: number): void => {
      quotes.forEach((quote) => {
        if (line.text.includes(quote)) {
          document.addError(this, 'Found typographer quote', {
            line: index + 1,
            column: line.indentation + line.keyword.length + (line.text.indexOf(quote) + 1),
          })
        }
      })
    })
  }

  public async fix(document: Document): Promise<void> {
    let replacer = `'`
    if (this.schema.args) {
      replacer = this.schema.args as string
    }

    document.lines.forEach((line: Line, index: number): void => {
      const quotes = ['“', '”', '‘', '’']
      quotes.forEach((quote) => {
        document.lines[index].text = line.text.replaceAll(quote, replacer)
      })
    })

    await document.regenerate()
  }
}
