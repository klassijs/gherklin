import { offOrKeywordIntsOrSeverityAndKeywordInts } from '../schemas.js';
import Schema from '../schema.js';
export default class Indentation {
    name = 'indentation';
    acceptedSchema = offOrKeywordIntsOrSeverityAndKeywordInts;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const args = this.schema.args;
        if (!args)
            return;
        // Helper: safely fetch numeric arg by dynamic key
        const numArg = (key) => args[key];
        // ----- Feature-level checks -----
        if (args.featureTag !== undefined && document.feature.tags.length) {
            const firstTagCol = document.feature.tags[0].location.column;
            if (firstTagCol !== args.featureTag) {
                document.addError(this, `Invalid indentation for feature tags. Got ${firstTagCol}, wanted ${args.featureTag}`, document.feature.tags[0].location);
            }
        }
        if (args.feature !== undefined) {
            const col = document.feature.location.column;
            if (col !== args.feature) {
                document.addError(this, `Invalid indentation for feature. Got ${col}, wanted ${args.feature}`, document.feature.location);
            }
        }
        // ----- Children (Backgrounds / Scenarios) -----
        document.feature.children.forEach((child) => {
            // Background block
            if (child.background && args.background !== undefined) {
                const bgCol = child.background.location.column;
                if (bgCol !== args.background) {
                    document.addError(this, `Invalid indentation for background. Got ${bgCol}, wanted ${args.background}`, child.background.location);
                }
            }
            // Scenario (or Scenario Outline)
            if (child.scenario) {
                const scenarioType = child.scenario.keyword === 'Scenario Outline'
                    ? 'scenarioOutline'
                    : 'scenario';
                const expectedScenario = numArg(scenarioType);
                if (expectedScenario !== undefined) {
                    const col = child.scenario.location.column;
                    if (col !== expectedScenario) {
                        document.addError(this, `Invalid indentation for ${scenarioType}. Got ${col}, wanted ${expectedScenario}`, child.scenario.location);
                    }
                }
                if (args.scenarioTag !== undefined && child.scenario.tags.length) {
                    const tagCol = child.scenario.tags[0].location.column;
                    if (tagCol !== args.scenarioTag) {
                        document.addError(this, `Invalid indentation for ${scenarioType} tags. Got ${tagCol}, wanted ${args.scenarioTag}`, child.scenario.tags[0].location);
                    }
                }
            }
            // Background steps
            if (child.background) {
                child.background.steps.forEach((step) => {
                    const key = step.keyword.toLowerCase();
                    const expected = numArg(key);
                    if (expected !== undefined) {
                        if (step.location.column !== expected) {
                            document.addError(this, `Invalid indentation for ${key}. Got ${step.location.column}, wanted ${expected}`, step.location);
                        }
                    }
                });
            }
            // Scenario / Outline steps + examples
            if (child.scenario) {
                child.scenario.steps.forEach((step) => {
                    const stepNormalized = step.keyword.toLowerCase().trimEnd();
                    const expected = numArg(stepNormalized);
                    if (expected !== undefined) {
                        if (step.location.column !== expected) {
                            document.addError(this, `Invalid indentation for ${stepNormalized}. Got ${step.location.column}, wanted ${expected}`, step.location);
                        }
                    }
                    if (step.dataTable && args.dataTable !== undefined) {
                        const dtCol = step.dataTable.location.column;
                        if (dtCol !== args.dataTable) {
                            document.addError(this, `Invalid indentation for ${stepNormalized} data table. Got ${dtCol}, wanted ${args.dataTable}`, step.dataTable.location);
                        }
                    }
                });
                // Examples (Scenario Outline only)
                child.scenario.examples?.forEach((example) => {
                    if (example.tableHeader && args.exampleTableHeader !== undefined) {
                        const hdrCol = example.tableHeader.location.column;
                        if (hdrCol !== args.exampleTableHeader) {
                            document.addError(this, `Invalid indentation for example table header. Got ${hdrCol}, wanted ${args.exampleTableHeader}`, example.tableHeader.location);
                        }
                    }
                    if (example.tableBody && args.exampleTableBody !== undefined) {
                        example.tableBody.forEach((row) => {
                            const rowCol = row.location.column;
                            if (rowCol !== args.exampleTableBody) {
                                document.addError(this, `Invalid indentation for example table row. Got ${rowCol}, wanted ${args.exampleTableBody}`, row.location);
                            }
                        });
                    }
                });
            }
        });
    }
    async fix(document) {
        const expectedIndentation = this.schema.args;
        const numArg = (key) => expectedIndentation[key];
        document.lines.forEach((line, index) => {
            const expected = numArg(line.safeKeyword);
            if (typeof expected === 'number') {
                // lines store indentation as "count of spaces before keyword",
                // expected is a 1-based "column"; subtract 1 to get indentation.
                document.lines[index].indentation = expected - 1;
            }
        });
        await document.regenerate();
    }
}
