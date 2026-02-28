import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class FeatureDescription implements Rule {
  public readonly name: string = 'feature-description'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  private defaultThreshold: number = 80

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    if (!document.feature.description) {
      document.addError(this, 'Feature is missing a description.', document.feature.location)
    }
  }
}
