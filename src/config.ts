import path from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import { parse as yamlParse } from 'yaml'

import { GherklinConfiguration, ReporterConfig, RuleConfiguration } from './types.js'

/**
 * The config class is responsible for loading and parsing config.
 *
 * It can accept inline config passed to its constructor.
 * It can also load configuration from a gherklin.config.ts/.yaml/.yml file.
 *
 * Once loaded, the config is parsed and added to member variables for access.
 */
export default class Config {
    // The directory where the config file itself is located
    public configDirectory?: string

    // The directory housing custom rules
    public customRulesDirectory?: string

    // The directory where the features are located
    public featureDirectory?: string

    // The max amount of errors before the process fails
    public maxErrors?: number

    // Configuration for each rule
    public rules?: RuleConfiguration

    // Configuration for the reporter
    public reporter?: ReporterConfig

    // The feature file to test
    public featureFile?: string

    // Whether or not to attempt to fix issues
    public fix?: boolean

    public constructor(inlineConfig?: GherklinConfiguration) {
        if (inlineConfig) {
            this.parse(inlineConfig)
            this.validate()
        }
    }

    private parse = (config: GherklinConfiguration): void => {
        this.configDirectory = config.configDirectory
        this.customRulesDirectory = config.customRulesDirectory
        this.featureDirectory = config.featureDirectory
        this.rules = config.rules
        this.reporter = config.reporter
        this.featureFile = config.featureFile
        this.maxErrors = config.maxErrors
        this.fix = config.fix
    }

    /**
     * Attempts to load config from a gherklin.config.* file
     */
    public fromFile = async (): Promise<Config> => {
        const configFile = this.getConfigFile()
        const configDir = path.dirname(configFile)

        const config = await this.loadConfigFromFile(configFile)
        config.configDirectory = configDir

        this.parse(config)
        this.validate()

        return this
    }

    /**
     * Resolve the path to the config file to use.
     * Order:
     *  1) GHERKLIN_CONFIG_FILE (absolute or relative to CWD)
     *  2) gherklin.config.ts
     *  3) gherklin.config.yaml
     *  4) gherklin.config.yml
     */
    public getConfigFile = (): string => {
        // 1) ENV override (accept absolute or relative path from CWD)
        const envPath = process.env.GHERKLIN_CONFIG_FILE
        if (envPath) {
            const candidate = path.isAbsolute(envPath)
                ? envPath
                : path.join(process.cwd(), envPath)
            if (existsSync(candidate)) {
                return candidate
            }
            throw new Error(
                `GHERKLIN_CONFIG_FILE was set to "${envPath}", but no file was found at "${candidate}".`,
            )
        }

        // 2) Autodiscover beside the project's package.json (i.e., CWD)
        const filesToCheck = [
            'gherklin.config.ts',
            'gherklin.config.yaml',
            'gherklin.config.yml',
        ]

        for (const file of filesToCheck) {
            const importPath = path.join(process.cwd(), file)
            if (existsSync(importPath)) {
                return importPath
            }
        }

        throw new Error(
            'Could not find a Gherklin config. Looked for gherklin.config.ts, gherklin.config.yaml, gherklin.config.yml or used GHERKLIN_CONFIG_FILE.',
        )
    }

    /**
     * Load the configuration from a resolved file path.
     * Supports:
     *  - .ts / .mts / .cts (ESM default export)
     *  - .yaml / .yml (YAML)
     */
    public loadConfigFromFile = async (
        filePath: string,
    ): Promise<GherklinConfiguration> => {
        const lower = filePath.toLowerCase()

        if (
            lower.endsWith('.ts') ||
            lower.endsWith('.mts') ||
            lower.endsWith('.cts')
        ) {
            const module = await import(pathToFileURL(filePath).href)
            if (!('default' in module)) {
                throw new Error(`Config file "${filePath}" does not export a default object`)
            }
            return module.default as GherklinConfiguration
        }

        if (lower.endsWith('.yaml') || lower.endsWith('.yml')) {
            const content = readFileSync(filePath, { encoding: 'utf-8' })
            return yamlParse(content) as GherklinConfiguration
        }

        throw new Error(`Unsupported config file "${filePath}". Expected .ts/.mts/.cts or .yaml/.yml`)
    }

    /**
     * Validates that the configuration contains all the necessary
     * information for Gherklin to run.
     */
    public validate = (): void => {
        const hasEnvFiles = !!process.env.GHERKLIN_FEATURE_FILES
        const hasEnvDir = !!process.env.GHERKLIN_FEATURE_DIR

        if (!this.featureDirectory && !this.featureFile && !hasEnvFiles && !hasEnvDir) {
            throw new Error(
                'Please specify either a featureDirectory or featureFile configuration option, or set GHERKLIN_FEATURE_DIR or GHERKLIN_FEATURE_FILES environment variable.',
            )
        }

        if (!this.rules || !Object.keys(this.rules).length) {
            throw new Error('Please specify a list of rules in your configuration.')
        }

        if (this.featureDirectory && this.featureFile) {
            throw new Error('Please only specify either a feature file or feature directory.')
        }
    }
}
