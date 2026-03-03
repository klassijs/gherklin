import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class NoDuplicateSteps implements Rule {
  public readonly name: string = 'no-duplicate-steps'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const checkSteps = (steps: ReadonlyArray<{ keyword: string; text: string; location: { line: number; column?: number } }>): void => {
      const seen = new Set<string>()
      for (const step of steps) {
        const key = `${step.keyword.trim()}|${step.text.trim()}`
        if (seen.has(key)) {
          document.addError(
            this,
            `Duplicate step in same scenario: "${step.keyword.trim()} ${step.text.trim()}".`,
            step.location,
          )
        }
        seen.add(key)
      }
    }

    document.feature.children.forEach((child) => {
      if (child.background?.steps?.length) {
        checkSteps(child.background.steps)
      }
      if (child.scenario?.steps?.length) {
        checkSteps(child.scenario.steps)
      }
    })
  }
}
