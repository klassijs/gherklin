import path from 'node:path'

import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class NoDupeFeatures implements Rule {
    public readonly name: string = 'no-dupe-features'
    public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema
    public readonly schema: Schema

    private features: Map<string, string[]> = new Map()

    public constructor(rawSchema: RawSchema) {
        this.schema = new Schema(rawSchema)
    }

    public async run(document: Document): Promise<void> {
        const featureName = document.feature.name
        const currentFile = path.basename(document.filename)

        if (!this.features.has(featureName)) {
            // first time we see this featureName
            this.features.set(featureName, [currentFile])
            return
        }

        // Merge current file into existing list (dedupe just in case)
        const prev = this.features.get(featureName) ?? []
        const next = [...prev, currentFile]
        this.features.set(featureName, next)

        // Report duplicates with a clear, joined list (sorted for deterministic output)
        const listed = [...next].sort().join(', ')
        document.addError(
            this,
            `Found duplicate feature "${featureName}" in "${listed}".`,
            document.feature.location,
        )
    }
}
