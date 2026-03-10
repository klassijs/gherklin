import path from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import { parse as yamlParse } from 'yaml'
import { cosmiconfig, type CosmiconfigResult } from 'cosmiconfig'

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

    // Configuration for the reporter (single or multiple)
    public reporter?: ReporterConfig | ReporterConfig[]

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
     * Attempts to load config from a gherklin config file, discovered from "anywhere".
     * Order:
     *  1) GHERKLIN_CONFIG_FILE (or GHERKLIN_CONFIG) absolute or relative to CWD
     *  2) cosmiconfig search (walk up from CWD; supports package.json, rc files, .config/)
     *  3) XDG locations ($XDG_CONFIG_HOME, then each path in $XDG_CONFIG_DIRS)
     *  4) legacy root files in CWD: gherklin.config.ts / .yaml / .yml
     */
    public fromFile = async (): Promise<Config> => {
        const configFile = await this.getConfigFile()
        const configDir = path.dirname(configFile)

        const config = await this.loadConfigFromFile(configFile)
        config.configDirectory = configDir

        this.parse(config)
        this.validate()

        return this
    }

    /**
     * Resolve the path to the config file to use (see "fromFile" for order).
     */
    public getConfigFile = async (): Promise<string> => {
        // 1) ENV override (accept absolute or relative path from CWD)
        const envPath = process.env.GHERKLIN_CONFIG_FILE || process.env.GHERKLIN_CONFIG
        if (envPath) {
            const candidate = path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath)
            if (existsSync(candidate)) {
                return candidate
            }
            throw new Error(
                `GHERKLIN_CONFIG_FILE was set to "${envPath}", but no file was found at "${candidate}".`,
            )
        }

        // 2) cosmiconfig search up from CWD (supports package.json key, rc files, .config/, TS/JS/YAML)
        const discovered = await this.resolveViaCosmiconfig()
        if (discovered) return discovered

        // 3) XDG (~/.config/gherklin/gherklin.config.* and entries in XDG_CONFIG_DIRS)
        const xdg = this.resolveViaXdg()
        if (xdg) return xdg

        // 4) Legacy root files beside CWD
        const filesToCheck = ['gherklin.config.ts', 'gherklin.config.yaml', 'gherklin.config.yml']
        for (const file of filesToCheck) {
            const p = path.join(process.cwd(), file)
            if (existsSync(p)) return p
        }

        throw new Error(
            'Could not find a Gherklin config. Looked for gherklin.config.ts, gherklin.config.yaml, gherklin.config.yml or used GHERKLIN_CONFIG_FILE.',
        )
    }

    /**
     * Use cosmiconfig to search for a config in conventional places while
     * walking up the directory tree from CWD.
     */
    private resolveViaCosmiconfig = async (): Promise<string | null> => {
        const searchPlaces = [
            'package.json',

            // rc files at root
            '.gherklinrc',
            '.gherklinrc.json',
            '.gherklinrc.yaml',
            '.gherklinrc.yml',
            '.gherklinrc.js',
            '.gherklinrc.ts',
            '.gherklinrc.mjs',
            '.gherklinrc.cjs',

            // rc files under .config/
            '.config/gherklinrc',
            '.config/gherklinrc.json',
            '.config/gherklinrc.yaml',
            '.config/gherklinrc.yml',
            '.config/gherklinrc.js',
            '.config/gherklinrc.ts',
            '.config/gherklinrc.mjs',
            '.config/gherklinrc.cjs',

            // dedicated config files at root
            'gherklin.config.ts',
            'gherklin.config.js',
            'gherklin.config.mjs',
            'gherklin.config.cjs',
            'gherklin.config.yaml',
            'gherklin.config.yml',

            // dedicated config files under .config/
            '.config/gherklin.config.ts',
            '.config/gherklin.config.js',
            '.config/gherklin.config.mjs',
            '.config/gherklin.config.cjs',
            '.config/gherklin.config.yaml',
            '.config/gherklin.config.yml',
        ]

        const explorer = cosmiconfig('gherklin', { mergeSearchPlaces: true, searchPlaces })
        const result: CosmiconfigResult | null = await explorer.search(process.cwd())
        if (result && !result.isEmpty && result.filepath) {
            return result.filepath
        }
        return null
    }

    /**
     * Check XDG locations for a global/shared config.
     * - $XDG_CONFIG_HOME/gherklin/gherklin.config.*
     * - each path in $XDG_CONFIG_DIRS
     */
    private resolveViaXdg = (): string | null => {
        const { XDG_CONFIG_HOME, XDG_CONFIG_DIRS, HOME } = process.env
        const candidates: string[] = []

        const base = XDG_CONFIG_HOME || (HOME ? path.join(HOME, '.config') : undefined)
        if (base) {
            candidates.push(
                path.join(base, 'gherklin/gherklin.config.yaml'),
                path.join(base, 'gherklin/gherklin.config.yml'),
                path.join(base, 'gherklin/gherklin.config.ts'),
                path.join(base, 'gherklin/gherklin.config.js'),
            )
        }

        const dirs = (XDG_CONFIG_DIRS && XDG_CONFIG_DIRS.split(':')) || ['/etc/xdg']
        for (const d of dirs) {
            candidates.push(
                path.join(d, 'gherklin/gherklin.config.yaml'),
                path.join(d, 'gherklin/gherklin.config.yml'),
                path.join(d, 'gherklin/gherklin.config.ts'),
                path.join(d, 'gherklin/gherklin.config.js'),
            )
        }

        for (const c of candidates) {
            if (existsSync(c)) return c
        }
        return null
    }

    /**
     * Load the configuration from a resolved file path.
     * Supports:
     *  - .ts / .mts / .cts (ESM default export)
     *  - .yaml / .yml (YAML)
     */
    public loadConfigFromFile = async (filePath: string): Promise<GherklinConfiguration> => {
        const lower = filePath.toLowerCase()

        if (lower.endsWith('.ts') || lower.endsWith('.mts') || lower.endsWith('.cts')) {
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

        throw new Error(
            `Unsupported config file "${filePath}". Expected .ts/.mts/.cts or .yaml/.yml`,
        )
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
