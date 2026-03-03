import { offOrNumberOrSeverityAndNumber } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

/**
 * Custom rule: enforce maximum length for the Feature name/title
 * (the text after "Feature: "). No built-in rule covers this.
 */
export default class FeatureNameLength implements Rule {
  public readonly name: string = 'feature-name-length'

  public readonly acceptedSchema: AcceptedSchema = offOrNumberOrSeverityAndNumber

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const maxLength =
      this.schema.args !== undefined ? Number(this.schema.args) : 100

    const name = (document.feature.name ?? '').trim()
    if (name.length > maxLength) {
      document.addError(
        this,
        `Feature name is too long. Expected max ${maxLength}, got ${name.length}.`,
        document.feature.location,
      )
    }
  }
}
