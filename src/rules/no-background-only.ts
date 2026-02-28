import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class NoBackgroundOnly implements Rule {
  public readonly name: string = 'no-background-only'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.background) {
        return
      }

      if (document.feature.children.length < 2) {
        document.addError(this, `File contains only a background.`, document.feature.location)
      }
    })
  }
}
