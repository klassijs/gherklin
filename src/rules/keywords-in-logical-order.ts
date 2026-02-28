import { dialects } from '@cucumber/gherkin'

import { switchOrSeveritySchema } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import { RawSchema, AcceptedSchema } from '../types.js'
import Document from '../document.js'

export default class KeywordsInLogicalOrder implements Rule {
    public readonly name: string = 'keywords-in-logical-order'
    public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema
    public readonly schema: Schema

    public constructor(rawSchema: RawSchema) {
        this.schema = new Schema(rawSchema)
    }

    public async run(document: Document): Promise<void> {
        document.feature.children.forEach((child) => {
            if (!child.scenario) return

            // ----- Dialect lookup with safe fallback -----
            // dialects is a record of language -> keyword arrays (strings with trailing spaces, e.g., 'Given ')
            const lang = document.feature.language as keyof typeof dialects
            const dialect = dialects[lang] ?? dialects.en

            // Explicitly coerce to string[] and filter out the '*' wildcard variant
            const given: string[] = (dialect.given as string[]).filter((w) => w !== '* ')
            const when:  string[] = (dialect.when  as string[]).filter((w) => w !== '* ')
            const then:  string[] = (dialect.then  as string[]).filter((w) => w !== '* ')
            const and:   string[] = (dialect.and   as string[]).filter((w) => w !== '* ')
            const but:   string[] = (dialect.but   as string[]).filter((w) => w !== '* ')

            // Pre-trimmed sets for error messages
            const trimmedWhen = when.map((w) => w.trim())
            const trimmedThen = then.map((w) => w.trim())
            const trimmedAnd  = and.map((w)  => w.trim())
            const trimmedBut  = but.map((w)  => w.trim())

            child.scenario.steps.forEach((step, index) => {
                const nextStep = child.scenario!.steps[index + 1]
                if (!nextStep) return

                const stepKw = step.keyword // e.g., 'Given ', 'When ', 'Then ', 'And ', 'But '
                const nextKw = nextStep.keyword
                const nextTrimmed = nextKw.trim()

                // Given must be followed by When/And/But
                if (given.includes(stepKw) && ![...and, ...but, ...when].includes(nextKw)) {
                    document.addError(
                        this,
                        `Expected "${stepKw.trim()}" to be followed by "${[...trimmedAnd, ...trimmedBut, ...trimmedWhen].join(', ')}", got "${nextTrimmed}"`,
                        step.location,
                    )
                }

                // When must be followed by Then/And/But
                if (when.includes(stepKw) && ![...and, ...but, ...then].includes(nextKw)) {
                    document.addError(
                        this,
                        `Expected "${stepKw.trim()}" to be followed by "${[...trimmedAnd, ...trimmedBut, ...trimmedThen].join(', ')}", got "${nextTrimmed}"`,
                        step.location,
                    )
                }

                // Then must be followed by And/When
                if (then.includes(stepKw) && ![...and, ...when].includes(nextKw)) {
                    document.addError(
                        this,
                        `Expected "${stepKw.trim()}" to be followed by "${[...trimmedAnd, ...trimmedWhen].join(', ')}", got "${nextTrimmed}"`,
                        step.location,
                    )
                }
            })
        })
    }
}
