import { offOrKeywordIntsOrSeverityAndKeywordInts } from '../schemas.js'
import Schema from '../schema.js'
import Rule from '../rule.js'
import {
    RawSchema,
    AcceptedSchema,
    GherkinKeywordNumericals,
} from '../types.js'
import Document from '../document.js'
import Line from '../line.js'

export default class Indentation implements Rule {
    public readonly name: string = 'indentation'
    public readonly acceptedSchema: AcceptedSchema =
        offOrKeywordIntsOrSeverityAndKeywordInts
    public readonly schema: Schema

    public constructor(rawSchema: RawSchema) {
        this.schema = new Schema(rawSchema)
    }

    /**
     * Parser columns are 1-based; config uses 0-based (0 = first column, no spaces).
     */
    private col0(parserCol: number | undefined): number {
        return (parserCol ?? 1) - 1
    }

    public async run(document: Document): Promise<void> {
        const args = this.schema.args as GherkinKeywordNumericals
        if (!args) return

        // Helper: safely fetch numeric arg by dynamic key
        const numArg = (key: string): number | undefined =>
            (args as Record<string, number | undefined>)[key]

        // ----- Feature-level checks -----
        if (args.featureTag !== undefined && document.feature.tags.length) {
            const got = this.col0(document.feature.tags[0].location.column)
            if (got !== args.featureTag) {
                document.addError(
                    this,
                    `Invalid indentation for feature tags. Got ${got}, wanted ${args.featureTag}`,
                    document.feature.tags[0].location,
                )
            }
        }

        if (args.feature !== undefined) {
            const got = this.col0(document.feature.location.column)
            if (got !== args.feature) {
                document.addError(
                    this,
                    `Invalid indentation for feature. Got ${got}, wanted ${args.feature}`,
                    document.feature.location,
                )
            }
        }

        // ----- Children (Backgrounds / Scenarios) -----
        document.feature.children.forEach((child) => {
            // Background block
            if (child.background && args.background !== undefined) {
                const got = this.col0(child.background.location.column)
                if (got !== args.background) {
                    document.addError(
                        this,
                        `Invalid indentation for background. Got ${got}, wanted ${args.background}`,
                        child.background.location,
                    )
                }
            }

            // Scenario (or Scenario Outline)
            if (child.scenario) {
                const scenarioType =
                    child.scenario.keyword === 'Scenario Outline'
                        ? 'scenarioOutline'
                        : 'scenario'

                const expectedScenario = numArg(scenarioType)
                if (expectedScenario !== undefined) {
                    const got = this.col0(child.scenario.location.column)
                    if (got !== expectedScenario) {
                        document.addError(
                            this,
                            `Invalid indentation for ${scenarioType}. Got ${got}, wanted ${expectedScenario}`,
                            child.scenario.location,
                        )
                    }
                }

                if (args.scenarioTag !== undefined && child.scenario.tags.length) {
                    const got = this.col0(child.scenario.tags[0].location.column)
                    if (got !== args.scenarioTag) {
                        document.addError(
                            this,
                            `Invalid indentation for ${scenarioType} tags. Got ${got}, wanted ${args.scenarioTag}`,
                            child.scenario.tags[0].location,
                        )
                    }
                }
            }

            // Background steps
            if (child.background) {
                child.background.steps.forEach((step) => {
                    const key = step.keyword.toLowerCase()
                    const expected = numArg(key)
                    if (expected !== undefined) {
                        const got = this.col0(step.location.column)
                        if (got !== expected) {
                            document.addError(
                                this,
                                `Invalid indentation for ${key}. Got ${got}, wanted ${expected}`,
                                step.location, // use the step location for precision
                            )
                        }
                    }
                })
            }

            // Scenario / Outline steps + examples
            if (child.scenario) {
                child.scenario.steps.forEach((step) => {
                    const stepNormalized = step.keyword.toLowerCase().trimEnd()
                    const expected = numArg(stepNormalized)
                    if (expected !== undefined) {
                        const got = this.col0(step.location.column)
                        if (got !== expected) {
                            document.addError(
                                this,
                                `Invalid indentation for ${stepNormalized}. Got ${got}, wanted ${expected}`,
                                step.location,
                            )
                        }
                    }

                    if (step.dataTable && args.dataTable !== undefined) {
                        const got = this.col0(step.dataTable.location.column)
                        if (got !== args.dataTable) {
                            document.addError(
                                this,
                                `Invalid indentation for ${stepNormalized} data table. Got ${got}, wanted ${args.dataTable}`,
                                step.dataTable.location,
                            )
                        }
                    }
                })

                // Examples (Scenario Outline only)
                child.scenario.examples?.forEach((example) => {
                    if (example.tableHeader && args.exampleTableHeader !== undefined) {
                        const got = this.col0(example.tableHeader.location.column)
                        if (got !== args.exampleTableHeader) {
                            document.addError(
                                this,
                                `Invalid indentation for example table header. Got ${got}, wanted ${args.exampleTableHeader}`,
                                example.tableHeader.location,
                            )
                        }
                    }

                    if (example.tableBody && args.exampleTableBody !== undefined) {
                        example.tableBody.forEach((row) => {
                            const got = this.col0(row.location.column)
                            if (got !== args.exampleTableBody) {
                                document.addError(
                                    this,
                                    `Invalid indentation for example table row. Got ${got}, wanted ${args.exampleTableBody}`,
                                    row.location,
                                )
                            }
                        })
                    }
                })
            }
        })
    }

    public async fix(document: Document): Promise<void> {
        const expectedIndentation = this.schema.args as GherkinKeywordNumericals
        const numArg = (key: string): number | undefined =>
            (expectedIndentation as Record<string, number | undefined>)[key]

        document.lines.forEach((line: Line, index: number) => {
            const expected = numArg(line.safeKeyword)
            if (typeof expected === 'number') {
                // Config is 0-based (0 = no spaces); lines store indentation as space count.
                document.lines[index].indentation = expected
            }
        })

        await document.regenerate()
    }
}
