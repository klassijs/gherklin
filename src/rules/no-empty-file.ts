import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class NoEmptyFile implements Rule {
  public readonly name: string = 'no-empty-file'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    if (document.feature.keyword === '') {
      document.addError(this, 'Feature file is empty.', {
        line: 0,
        column: 0,
      })
    }
  }
}
