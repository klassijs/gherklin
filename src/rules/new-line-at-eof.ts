import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'
import Line from '../line.js'

export default class NewLineAtEof implements Rule {
  public readonly name: string = 'new-line-at-eof'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const lines = document.lines

    const lastLine = lines[lines.length - 1]
    if (lastLine.text !== '') {
      document.addError(this, 'No new line at end of file.', {
        line: lines.length,
        column: 0,
      })
    }
  }

  public async fix(document: Document): Promise<void> {
    document.lines.push(new Line(''))
    await document.regenerate()
  }
}
