import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class FilenameCamelCase implements Rule {
  public readonly name: string = 'filename-camel-case'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    if (!/^[a-z][a-zA-Z0-9]*\.feature$/.test(document.filename)) {
      document.addError(this, `File names should be camelCase. Got "${document.filename}".`, {
        line: 1,
        column: 1,
      })
    }
  }
}
