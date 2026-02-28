import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'
import Line from '../line.js'

export default class NoFullStop implements Rule {
  public readonly name: string = 'no-full-stop'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.lines.forEach((line: Line, index: number): void => {
      const trimmed = line.text.trimEnd()
      if (trimmed[trimmed.length - 1] === '.') {
        document.addError(this, `Line ends with a full stop.`, {
          line: index + 1,
          column: (line.keyword + trimmed).length,
        })
      }
    })
  }

  public async fix(document: Document): Promise<void> {
    document.lines.forEach((line: Line, index: number): void => {
      const trimmed = line.text.trimEnd()
      if (trimmed[trimmed.length - 1] === '.') {
        document.lines[index].text = trimmed.substring(0, trimmed.length - 1)
      }
    })

    await document.regenerate()
  }
}
