import { offOrNumberOrSeverityAndNumber } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class MaxStepsPerScenario implements Rule {
  public readonly name: string = 'max-steps-per-scenario'

  public readonly acceptedSchema: AcceptedSchema = offOrNumberOrSeverityAndNumber

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const maxSteps = this.schema.args as number
    if (typeof maxSteps !== 'number' || maxSteps < 1) return

    document.feature.children.forEach((child) => {
      if (child.scenario?.steps?.length) {
        const count = child.scenario.steps.length
        if (count > maxSteps) {
          document.addError(
            this,
            `Scenario has ${count} steps. Maximum allowed is ${maxSteps}.`,
            child.scenario.location,
          )
        }
      }
    })
  }
}
