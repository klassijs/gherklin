import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

const ENDS_WITH_PUNCT = /[.!?]$/

export default class NoPunctuationInTitles implements Rule {
  public readonly name: string = 'no-punctuation-in-titles'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const featureName = (document.feature.name ?? '').trim()
    if (ENDS_WITH_PUNCT.test(featureName)) {
      document.addError(
        this,
        'Feature title must not end with punctuation (. ! ?).',
        document.feature.location,
      )
    }

    document.feature.children.forEach((child) => {
      if (!child.scenario) return

      const scenarioName = (child.scenario.name ?? '').trim()
      if (ENDS_WITH_PUNCT.test(scenarioName)) {
        document.addError(
          this,
          'Scenario title must not end with punctuation (. ! ?).',
          child.scenario.location,
        )
      }
    })
  }
}
