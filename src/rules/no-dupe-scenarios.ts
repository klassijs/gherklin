import path from 'node:path'

import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class NoDupeScenarios implements Rule {
    public readonly name: string = 'no-dupe-scenarios'
    public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema
    public readonly schema: Schema

    private scenarios: Map<string, string[]> = new Map()

    public constructor(rawSchema: RawSchema) {
        this.schema = new Schema(rawSchema)
    }

    public async run(document: Document): Promise<void> {
        const currentFile = path.basename(document.filename)

        document.feature.children.forEach((child) => {
            if (!child.scenario) return

            const scenarioName = child.scenario.name

            if (!this.scenarios.has(scenarioName)) {
                // First time we see this scenario name
                this.scenarios.set(scenarioName, [currentFile])
                return
            }

            // Merge current file into existing list (dedupe just in case)
            const prev = this.scenarios.get(scenarioName) ?? []
            const next = prev.includes(currentFile) ? prev : [...prev, currentFile]
            this.scenarios.set(scenarioName, next)

            // Report duplicates using the updated list
            const listed = next.join(', ')
            document.addError(
                this,
                `Found duplicate scenario "${scenarioName}" in "${listed}".`,
                child.scenario.location,
            )
        })
    }
}
