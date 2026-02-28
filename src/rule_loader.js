import path from 'node:path';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export default class RuleLoader {
    config;
    rules = [];
    constructor(config) {
        this.config = config;
    }
    load = async (ruleName, rawSchema, customDir) => {
        let location = path.resolve(import.meta.dirname, `./rules/${ruleName}.ts`);
        // If this rule doesn't appear in the defaults, we'll need to look for it in the custom rules dir
        if (!existsSync(location)) {
            if (customDir) {
                // Import files relative to the location of the config file
                const customLocation = path.join(this.config.configDirectory, customDir, `${ruleName}.ts`);
                if (!existsSync(customLocation)) {
                    throw new Error(`could not find rule "${ruleName}" in default rules or "${customDir}".`);
                }
                location = customLocation;
            }
            else {
                throw new Error(`could not find rule "${ruleName}" in default rules.\nIf this is a custom rule, please specify "customRulesDirectory" in the config.`);
            }
        }
        const klass = await import(pathToFileURL(location.replace('.ts', '')).href);
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
            // Attempt to fix the original document
            if (this.config.fix === true && rule.fix !== undefined) {
                await rule.fix(document);
            }
            await rule.run(document);
        }
        return document.errors;
    };
}
