import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'
import Line from '../line.js'

function isEmptyLine(line: Line): boolean {
  return (line.keyword + line.text).trim().length === 0
}

export default class NoConsecutiveEmptyLines implements Rule {
  public readonly name: string = 'no-consecutive-empty-lines'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    let prevEmpty = false
    document.lines.forEach((line: Line, index: number) => {
      const empty = isEmptyLine(line)
      if (empty && prevEmpty) {
        document.addError(this, 'Consecutive empty lines are not allowed.', {
          line: index + 1,
          column: 1,
        })
      }
      prevEmpty = empty
    })
  }

  public async fix(document: Document): Promise<void> {
    const result: Line[] = []
    let prevEmpty = false
    for (const line of document.lines) {
      const empty = isEmptyLine(line)
      if (empty && prevEmpty) continue
      result.push(line)
      prevEmpty = empty
    }
    document.lines.length = 0
    document.lines.push(...result)
    await document.regenerate()
  }
}
