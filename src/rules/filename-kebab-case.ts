import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class FilenameKebabCase implements Rule {
  public readonly name: string = 'filename-kebab-case'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    if (!/^[^_|\s]+(?=-?)[^_|\s]+.feature$/.test(document.filename)) {
      document.addError(this, `File names should be kebab-case. Got "${document.filename}".`, {
        line: 1,
        column: 1,
      })
      return
    }
    if (document.filename !== document.filename.toLowerCase()) {
      document.addError(this, `File names should be kebab-case. Got "${document.filename}".`, {
        line: 1,
        column: 1,
      })
    }
  }
}
