import path from 'node:path';
import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class NoDupeScenarios {
    name = 'no-dupe-scenarios';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    scenarios = new Map();
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        const currentFile = path.basename(document.filename);
        document.feature.children.forEach((child) => {
            if (!child.scenario)
                return;
            const scenarioName = child.scenario.name;
            if (!this.scenarios.has(scenarioName)) {
                // First time we see this scenario name
                this.scenarios.set(scenarioName, [currentFile]);
                return;
            }
            // Merge current file into existing list (dedupe just in case)
            const prev = this.scenarios.get(scenarioName) ?? [];
            const next = prev.includes(currentFile) ? prev : [...prev, currentFile];
            this.scenarios.set(scenarioName, next);
            // Report duplicates using the updated list
            const listed = next.join(', ');
            document.addError(this, `Found duplicate scenario "${scenarioName}" in "${listed}".`, child.scenario.location);
        });
    }
}
