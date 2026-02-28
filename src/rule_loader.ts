import path from 'node:path'
import { existsSync } from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'

import Rule from './rule.js'
import Document from './document.js'
import { LintError, RawSchema } from './types.js'
import Config from './config.js'

/**
 * Resolve a candidate file by checking .js first (built output),
 * then .ts (source, useful during local dev).
 */
function resolveWithJsThenTs(base: string, rel: string): string | null {
    const asJs = path.resolve(base, `${rel}.js`)
    if (existsSync(asJs)) return asJs

    const asTs = path.resolve(base, `${rel}.ts`)
    if (existsSync(asTs)) return asTs

    return null
}

export default class RuleLoader {
    private config: Config
    private rules: Array<Rule> = []

    public constructor(config: Config) {
        this.config = config
    }

    public load = async (ruleName: string, rawSchema: RawSchema, customDir?: string): Promise<void> => {
        // Compute a dirname that works in ESM
        const __dirname = path.dirname(fileURLToPath(import.meta.url))

        // 1) Try default (built) rules: ./rules/<ruleName>.js then .ts
        let location =
            resolveWithJsThenTs(__dirname, `./rules/${ruleName}`)

        // 2) If not found, try custom rules directory (when provided)
        if (!location) {
            if (customDir) {
                // Resolve relative to the *config* directory (fall back to CWD if missing)
                const baseDir = this.config.configDirectory ?? process.cwd()

                location =
                    resolveWithJsThenTs(baseDir, path.join(customDir, ruleName))

                if (!location) {
                    throw new Error(
                        `could not find rule "${ruleName}" in default rules or "${customDir}".`,
                    )
                }
            } else {
                throw new Error(
                    `could not find rule "${ruleName}" in default rules.\n` +
                    `If this is a custom rule, please specify "customRulesDirectory" in the config.`,
                )
            }
        }

        // 3) Dynamically import the resolved module (ESM-safe)
        const modUrl = pathToFileURL(location).href
        const klass = await import(modUrl)

        // 4) Instantiate and store
        this.rules.push(new klass.default(rawSchema))
    }

    public validateRules = (): Map<string, Array<string>> => {
        const errors: Map<string, Array<string>> = new Map()

        this.rules.forEach((rule): void => {
            const schemaErrors = rule.schema.validate(rule.acceptedSchema)
            if (schemaErrors.length) {
                errors.set(rule.name, schemaErrors)
            }
        })

        return errors
    }

    public runRules = async (document: Document): Promise<Array<LintError>> => {
        for (const rule of this.rules) {
            if (!rule.schema.enabled || document.disabled) {
                continue
            }

            // Attempt to fix the original document (when enabled and supported)
            if (this.config.fix === true && rule.fix !== undefined) {
                await rule.fix(document)
            }

            await rule.run(document)
        }

        return document.errors
    }
}
