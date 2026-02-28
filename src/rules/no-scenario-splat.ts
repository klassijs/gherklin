import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class NoScenarioSplat implements Rule {
  public readonly name: string = 'no-scenario-splat'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child): void => {
      if (!child.scenario) {
        return
      }

      child.scenario.steps.forEach((step): void => {
        if (step.keyword.trim() === '*') {
          document.addError(this, 'Found a splat (*) inside a scenario.', step.location)
        }
      })
    })
  }
}
