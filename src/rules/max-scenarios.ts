import { offOrNumberOrSeverityAndNumber } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class MaxScenarios implements Rule {
  public readonly name: string = 'max-scenarios'

  public readonly acceptedSchema: AcceptedSchema = offOrNumberOrSeverityAndNumber

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    let scenarioCount = 0
    document.feature.children.forEach((child) => {
      if (child.scenario) {
        scenarioCount += 1
      }
    })

    const expected = this.schema.args as number
    if (scenarioCount > expected) {
      document.addError(
        this,
        `Expected max ${expected} scenarios per file. Found ${scenarioCount}.`,
        document.feature.location,
      )
    }
  }
}
