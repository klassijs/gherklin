import { switchOrSeverityorSeverityAndStringSchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class TagFormat implements Rule {
  public readonly name: string = 'tag-format'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeverityorSeverityAndStringSchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const patternSource = this.schema.args as string | undefined
    if (typeof patternSource !== 'string' || !patternSource) return

    let re: RegExp
    try {
      re = new RegExp(patternSource)
    } catch {
      return
    }

    const checkTags = (tags: ReadonlyArray<{ name: string; location: { line: number; column?: number } }>): void => {
      tags.forEach((tag) => {
        if (!re.test(tag.name)) {
          document.addError(
            this,
            `Tag "${tag.name}" does not match required format: ${patternSource}`,
            tag.location,
          )
        }
      })
    }

    if (document.feature.tags?.length) {
      checkTags(document.feature.tags)
    }

    document.feature.children.forEach((child) => {
      if (child.scenario?.tags?.length) {
        checkTags(child.scenario.tags)
      }
    })
  }
}
