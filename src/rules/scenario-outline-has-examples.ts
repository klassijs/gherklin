import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class ScenarioOutlineHasExamples implements Rule {
  public readonly name: string = 'scenario-outline-has-examples'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.scenario) return
      if (child.scenario.keyword !== 'Scenario Outline') return

      const examples = child.scenario.examples
      if (!examples || examples.length === 0) {
        document.addError(
          this,
          'Scenario Outline must have at least one Examples block.',
          child.scenario.location,
        )
      }
    })
  }
}
