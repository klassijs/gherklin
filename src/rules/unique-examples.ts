import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class UniqueExamples implements Rule {
    public readonly name: string = 'unique-examples'
    public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema
    public readonly schema: Schema

    public constructor(rawSchema: RawSchema) {
        this.schema = new Schema(rawSchema)
    }

    public async run(document: Document): Promise<void> {
        document.feature.children.forEach((child) => {
            // Only applies to scenarios
            if (!child.scenario) return

            // Only applies to "Scenario Outline"
            if (child.scenario.keyword !== 'Scenario Outline') return

            const examples = child.scenario.examples ?? []
            if (examples.length === 0) return

            const names: string[] = []

            examples.forEach((e) => {
                const name = e.name ?? '' // normalize to string for dedupe
                if (!names.includes(name)) {
                    names.push(name)
                    return
                }

                // Duplicate example name detected
                document.addError(
                    this,
                    'Examples should contain a unique name if there are more than one.',
                    e.location,
                )
            })
        })
    }
}
