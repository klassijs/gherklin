import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class BackgroundSetupOnly implements Rule {
  public readonly name: string = 'background-setup-only'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.background) {
        return
      }

      child.background.steps.forEach((step): void => {
        if (!['Given', '*'].includes(step.keyword.trim())) {
          document.addError(
            this,
            `Background should only be used for set up. Found "${step.keyword.trim()}".`,
            step.location,
          )
        }
      })
    })
  }
}
