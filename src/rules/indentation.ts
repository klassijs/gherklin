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

    public async run(document: Document): Promise<void> {
        const args = this.schema.args as GherkinKeywordNumericals
        if (!args) return

        // Helper: safely fetch numeric arg by dynamic key
        const numArg = (key: string): number | undefined =>
            (args as Record<string, number | undefined>)[key]

        // ----- Feature-level checks -----
        if (args.featureTag !== undefined && document.feature.tags.length) {
            const firstTagCol = document.feature.tags[0].location.column
            if (firstTagCol !== args.featureTag) {
                document.addError(
                    this,
                    `Invalid indentation for feature tags. Got ${firstTagCol}, wanted ${args.featureTag}`,
                    document.feature.tags[0].location,
                )
            }
        }

        if (args.feature !== undefined) {
            const col = document.feature.location.column
            if (col !== args.feature) {
                document.addError(
                    this,
                    `Invalid indentation for feature. Got ${col}, wanted ${args.feature}`,
                    document.feature.location,
                )
            }
        }

        // ----- Children (Backgrounds / Scenarios) -----
        document.feature.children.forEach((child) => {
            // Background block
            if (child.background && args.background !== undefined) {
                const bgCol = child.background.location.column
                if (bgCol !== args.background) {
                    document.addError(
                        this,
                        `Invalid indentation for background. Got ${bgCol}, wanted ${args.background}`,
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
                    const col = child.scenario.location.column
                    if (col !== expectedScenario) {
                        document.addError(
                            this,
                            `Invalid indentation for ${scenarioType}. Got ${col}, wanted ${expectedScenario}`,
                            child.scenario.location,
                        )
                    }
                }

                if (args.scenarioTag !== undefined && child.scenario.tags.length) {
                    const tagCol = child.scenario.tags[0].location.column
                    if (tagCol !== args.scenarioTag) {
                        document.addError(
                            this,
                            `Invalid indentation for ${scenarioType} tags. Got ${tagCol}, wanted ${args.scenarioTag}`,
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
                        if (step.location.column !== expected) {
                            document.addError(
                                this,
                                `Invalid indentation for ${key}. Got ${step.location.column}, wanted ${expected}`,
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
                        if (step.location.column !== expected) {
                            document.addError(
                                this,
                                `Invalid indentation for ${stepNormalized}. Got ${step.location.column}, wanted ${expected}`,
                                step.location,
                            )
                        }
                    }

                    if (step.dataTable && args.dataTable !== undefined) {
                        const dtCol = step.dataTable.location.column
                        if (dtCol !== args.dataTable) {
                            document.addError(
                                this,
                                `Invalid indentation for ${stepNormalized} data table. Got ${dtCol}, wanted ${args.dataTable}`,
                                step.dataTable.location,
                            )
                        }
                    }
                })

                // Examples (Scenario Outline only)
                child.scenario.examples?.forEach((example) => {
                    if (example.tableHeader && args.exampleTableHeader !== undefined) {
                        const hdrCol = example.tableHeader.location.column
                        if (hdrCol !== args.exampleTableHeader) {
                            document.addError(
                                this,
                                `Invalid indentation for example table header. Got ${hdrCol}, wanted ${args.exampleTableHeader}`,
                                example.tableHeader.location,
                            )
                        }
                    }

                    if (example.tableBody && args.exampleTableBody !== undefined) {
                        example.tableBody.forEach((row) => {
                            const rowCol = row.location.column
                            if (rowCol !== args.exampleTableBody) {
                                document.addError(
                                    this,
                                    `Invalid indentation for example table row. Got ${rowCol}, wanted ${args.exampleTableBody}`,
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
                // lines store indentation as "count of spaces before keyword",
                // expected is a 1-based "column"; subtract 1 to get indentation.
                document.lines[index].indentation = expected - 1
            }
        })

        await document.regenerate()
    }
}
