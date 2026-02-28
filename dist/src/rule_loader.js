import path from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
/**
 * Resolve a candidate file by checking .js first (built output),
 * then .ts (source, useful during local dev).
 */
function resolveWithJsThenTs(base, rel) {
    const asJs = path.resolve(base, `${rel}.js`);
    if (existsSync(asJs))
        return asJs;
    const asTs = path.resolve(base, `${rel}.ts`);
    if (existsSync(asTs))
        return asTs;
    return null;
}
export default class RuleLoader {
    config;
    rules = [];
    constructor(config) {
        this.config = config;
    }
    load = async (ruleName, rawSchema, customDir) => {
        // Compute a dirname that works in ESM
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        // 1) Try default (built) rules: ./rules/<ruleName>.js then .ts
        let location = resolveWithJsThenTs(__dirname, `./rules/${ruleName}`);
        // 2) If not found, try custom rules directory (when provided)
        if (!location) {
            if (customDir) {
                // Resolve relative to the *config* directory (fall back to CWD if missing)
                const baseDir = this.config.configDirectory ?? process.cwd();
                location =
                    resolveWithJsThenTs(baseDir, path.join(customDir, ruleName));
                if (!location) {
                    throw new Error(`could not find rule "${ruleName}" in default rules or "${customDir}".`);
                }
            }
            else {
                throw new Error(`could not find rule "${ruleName}" in default rules.\n` +
                    `If this is a custom rule, please specify "customRulesDirectory" in the config.`);
            }
        }
        // 3) Dynamically import the resolved module (ESM-safe)
        const modUrl = pathToFileURL(location).href;
        const klass = await import(modUrl);
        // 4) Instantiate and store
        this.rules.push(new klass.default(rawSchema));
    };
    validateRules = () => {
        const errors = new Map();
        this.rules.forEach((rule) => {
            const schemaErrors = rule.schema.validate(rule.acceptedSchema);
            if (schemaErrors.length) {
                errors.set(rule.name, schemaErrors);
            }
        });
        return errors;
    };
    runRules = async (document) => {
        for (const rule of this.rules) {
            if (!rule.schema.enabled || document.disabled) {
                continue;
            }
            // Attempt to fix the original document (when enabled and supported)
            if (this.config.fix === true && rule.fix !== undefined) {
                await rule.fix(document);
            }
            await rule.run(document);
        }
        return document.errors;
    };
}
