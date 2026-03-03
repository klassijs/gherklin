import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class OneFeaturePerFile implements Rule {
  public readonly name: string = 'one-feature-per-file'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const featureLineIndices: number[] = []
    document.lines.forEach((line, index) => {
      const kw = (line.keyword ?? '').trim()
      if (kw === 'Feature') {
        featureLineIndices.push(index + 1)
      }
    })

    if (featureLineIndices.length > 1) {
      document.addError(
        this,
        `File must contain at most one Feature. Found ${featureLineIndices.length}.`,
        { line: featureLineIndices[1], column: 1 },
      )
    }
  }
}
