import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

const GIVEN_WHEN_THEN = new Set(['given', 'when', 'then'])

function stepKeywordKey(keyword: string): string {
  return keyword.trim().toLowerCase()
}

export default class NoAndButFirst implements Rule {
  public readonly name: string = 'no-and-but-first'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (child.background?.steps?.length) {
        const first = child.background.steps[0]
        const key = stepKeywordKey(first.keyword)
        if (!GIVEN_WHEN_THEN.has(key)) {
          document.addError(
            this,
            'First step in Background must be Given, When, or Then, not And or But.',
            first.location,
          )
        }
      }

      if (child.scenario?.steps?.length) {
        const first = child.scenario.steps[0]
        const key = stepKeywordKey(first.keyword)
        if (!GIVEN_WHEN_THEN.has(key)) {
          document.addError(
            this,
            'First step in Scenario must be Given, When, or Then, not And or But.',
            first.location,
          )
        }
      }
    })
  }
}
