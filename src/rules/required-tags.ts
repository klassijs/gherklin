import { offOrStringArrayOrSeverityAndStringArray } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class RequiredTags implements Rule {
  public readonly name: string = 'required-tags'

  public readonly acceptedSchema: AcceptedSchema = offOrStringArrayOrSeverityAndStringArray

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const requiredTags = this.schema.args as Array<string>
    if (!requiredTags?.length) return

    document.feature.children.forEach((child) => {
      if (!child.scenario) return

      const tagNames = child.scenario.tags?.map((t) => t.name) ?? []
      const hasRequired = requiredTags.some((req) => tagNames.includes(req))
      if (!hasRequired) {
        document.addError(
          this,
          `Scenario must have at least one of the required tags: ${requiredTags.join(', ')}.`,
          child.scenario.location,
        )
      }
    })
  }
}
