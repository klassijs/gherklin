import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class NoEmptyScenario implements Rule {
  public readonly name: string = 'no-empty-scenario'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.scenario) return

      const steps = child.scenario.steps ?? []
      if (steps.length === 0) {
        document.addError(
          this,
          'Scenario must have at least one step.',
          child.scenario.location,
        )
      }
    })
  }
}
