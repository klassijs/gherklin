import { dialects } from '@cucumber/gherkin';
import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class KeywordsInLogicalOrder {
    name = 'keywords-in-logical-order';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.feature.children.forEach((child) => {
            if (!child.scenario)
                return;
            // ----- Dialect lookup with safe fallback -----
            // dialects is a record of language -> keyword arrays (strings with trailing spaces, e.g., 'Given ')
            const lang = document.feature.language;
            const dialect = dialects[lang] ?? dialects.en;
            // Explicitly coerce to string[] and filter out the '*' wildcard variant
            const given = dialect.given.filter((w) => w !== '* ');
            const when = dialect.when.filter((w) => w !== '* ');
            const then = dialect.then.filter((w) => w !== '* ');
            const and = dialect.and.filter((w) => w !== '* ');
            const but = dialect.but.filter((w) => w !== '* ');
            // Pre-trimmed sets for error messages
            const trimmedWhen = when.map((w) => w.trim());
            const trimmedThen = then.map((w) => w.trim());
            const trimmedAnd = and.map((w) => w.trim());
            const trimmedBut = but.map((w) => w.trim());
            child.scenario.steps.forEach((step, index) => {
                const nextStep = child.scenario.steps[index + 1];
                if (!nextStep)
                    return;
                const stepKw = step.keyword; // e.g., 'Given ', 'When ', 'Then ', 'And ', 'But '
                const nextKw = nextStep.keyword;
                const nextTrimmed = nextKw.trim();
                // Given must be followed by When/And/But
                if (given.includes(stepKw) && ![...and, ...but, ...when].includes(nextKw)) {
                    document.addError(this, `Expected "${stepKw.trim()}" to be followed by "${[...trimmedAnd, ...trimmedBut, ...trimmedWhen].join(', ')}", got "${nextTrimmed}"`, step.location);
                }
                // When must be followed by Then/And/But
                if (when.includes(stepKw) && ![...and, ...but, ...then].includes(nextKw)) {
                    document.addError(this, `Expected "${stepKw.trim()}" to be followed by "${[...trimmedAnd, ...trimmedBut, ...trimmedThen].join(', ')}", got "${nextTrimmed}"`, step.location);
                }
                // Then must be followed by And/When
                if (then.includes(stepKw) && ![...and, ...when].includes(nextKw)) {
                    document.addError(this, `Expected "${stepKw.trim()}" to be followed by "${[...trimmedAnd, ...trimmedWhen].join(', ')}", got "${nextTrimmed}"`, step.location);
                }
            });
        });
    }
}
//# sourceMappingURL=keywords-in-logical-order.js.map