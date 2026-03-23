import { offOrNumberOrSeverityOrSeverityAndNumber } from '../schemas.js';
import Schema from '../schema.js';
import { levenshtein } from '../utils.js';
export default class NoSimilarScenarios {
    name = 'no-similar-scenarios';
    acceptedSchema = offOrNumberOrSeverityOrSeverityAndNumber;
    schema;
    defaultThreshold = 80;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        // Resolve threshold: allow args to override if it's a number
        const resolvedThreshold = (typeof this.schema.args === 'number' ? this.schema.args : this.defaultThreshold);
        document.feature.children.forEach((child) => {
            if (!child.scenario)
                return;
            // Capture the scenario to preserve the type‑narrowing throughout
            const scenario = child.scenario;
            const { steps: thisSteps } = scenario;
            // Build a list of the *other* scenarios (exclude current)
            const otherScenarios = document.feature.children
                .map(c => c.scenario)
                .filter((s) => Boolean(s && s.id !== scenario.id));
            // Compare current scenario against each "other"
            otherScenarios.forEach((other) => {
                // Compute Levenshtein totals for this pair only
                let pairLevTotal = 0;
                let pairMaxPossible = 0;
                thisSteps.forEach((step, i) => {
                    const nextStep = other.steps[i];
                    if (!nextStep)
                        return;
                    const left = `${step.keyword}${step.text}`;
                    const right = `${nextStep.keyword}${nextStep.text}`;
                    pairMaxPossible += left.length + right.length;
                    pairLevTotal += levenshtein(left, right);
                });
                // Avoid divide-by-zero if no comparable steps
                if (pairMaxPossible === 0)
                    return;
                const percentage = 100 - (pairLevTotal / pairMaxPossible) * 100;
                if (percentage > resolvedThreshold) {
                    document.addError(this, `Scenario "${scenario.name}" is too similar (> ${resolvedThreshold}%) to scenario "${other.name}".`, scenario.location);
                }
            });
        });
    }
}
//# sourceMappingURL=no-similar-scenarios.js.map