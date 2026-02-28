import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class ScenarioVerification implements Rule {
  public readonly name: string = 'scenario-verification'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.scenario) {
        return
      }

      const whens = child.scenario.steps.filter((s) => s.keyword.trim() === 'Then')
      if (whens.length === 0) {
        document.addError(
          this,
          'Scenario should contain a "Then" to denote verification of an action.',
          child.scenario.location,
        )
      }
    })
  }
}
