import { offOrNumberOrSeverityAndNumber } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class MaxBackgroundSteps implements Rule {
  public readonly name: string = 'max-background-steps'

  public readonly acceptedSchema: AcceptedSchema = offOrNumberOrSeverityAndNumber

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const maxSteps = this.schema.args as number
    if (typeof maxSteps !== 'number' || maxSteps < 0) return

    document.feature.children.forEach((child) => {
      if (!child.background?.steps?.length) return

      const count = child.background.steps.length
      if (count > maxSteps) {
        document.addError(
          this,
          `Background has ${count} steps. Maximum allowed is ${maxSteps}.`,
          child.background.location,
        )
      }
    })
  }
}
