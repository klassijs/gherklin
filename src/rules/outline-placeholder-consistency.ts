import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

const PLACEHOLDER_RE = /<([^>]+)>/g

function getPlaceholders(text: string): Set<string> {
  const set = new Set<string>()
  let m: RegExpExecArray | null
  PLACEHOLDER_RE.lastIndex = 0
  while ((m = PLACEHOLDER_RE.exec(text)) !== null) {
    set.add(m[1])
  }
  return set
}

export default class OutlinePlaceholderConsistency implements Rule {
  public readonly name: string = 'outline-placeholder-consistency'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.scenario || child.scenario.keyword !== 'Scenario Outline') return

      const examples = child.scenario.examples ?? []
      if (examples.length === 0) return

      const stepsPlaceholders = new Set<string>()
      child.scenario.steps.forEach((step) => {
        getPlaceholders(step.text).forEach((p) => stepsPlaceholders.add(p))
      })

      const allHeaderNames = new Set<string>()
      examples.forEach((example) => {
        const header = example.tableHeader
        if (!header?.cells?.length) return

        const headerNames = header.cells.map((c) => c.value)
        headerNames.forEach((n) => allHeaderNames.add(n))

        for (const name of headerNames) {
          if (!stepsPlaceholders.has(name)) {
            document.addError(
              this,
              `Placeholder "<${name}>" appears in Examples but not in any step.`,
              header.location,
            )
          }
        }
      })

      for (const name of stepsPlaceholders) {
        if (!allHeaderNames.has(name)) {
          document.addError(
            this,
            `Placeholder "<${name}>" is used in steps but not in any Examples header.`,
            child.scenario!.location,
          )
        }
      }
    })
  }
}
