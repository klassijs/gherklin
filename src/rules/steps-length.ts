import { offOrNumberOrSeverityAndNumber } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class StepsLength implements Rule {
  public readonly name: string = 'steps-length'

  public readonly acceptedSchema: AcceptedSchema = offOrNumberOrSeverityAndNumber

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    let maxLength = 80
    if (this.schema.args !== undefined) {
      maxLength = Number(this.schema.args)
    }

    const checkStep = (step: { text?: string; location: { line: number; column?: number } }): void => {
      const text = step.text ?? ''
      if (text.length > maxLength) {
        document.addError(
          this,
          `Step text is too long. Expected max ${maxLength}, got ${text.length}.`,
          step.location,
        )
      }
    }

    document.feature.children.forEach((child) => {
      if (child.background?.steps) {
        child.background.steps.forEach(checkStep)
      }
      if (child.scenario?.steps) {
        child.scenario.steps.forEach(checkStep)
      }
    })
  }
}
