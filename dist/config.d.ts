import { GherklinConfiguration, ReporterConfig, RuleConfiguration } from './types.js';
/**
 * The config class is responsible for loading and parsing config.
 *
 * It can accept inline config passed to its constructor.
 * It can also load configuration from a gherklin.config.ts/.yaml/.yml file.
 *
 * Once loaded, the config is parsed and added to member variables for access.
 */
export default class Config {
    configDirectory?: string;
    customRulesDirectory?: string;
    featureDirectory?: string;
    maxErrors?: number;
    rules?: RuleConfiguration;
    reporter?: ReporterConfig | ReporterConfig[];
    featureFile?: string;
    fix?: boolean;
    constructor(inlineConfig?: GherklinConfiguration);
    private parse;
    /**
     * Attempts to load config from a gherklin config file, discovered from "anywhere".
     * Order:
     *  1) GHERKLIN_CONFIG_FILE (or GHERKLIN_CONFIG) absolute or relative to CWD
     *  2) cosmiconfig search (walk up from CWD; supports package.json, rc files, .config/)
     *  3) XDG locations ($XDG_CONFIG_HOME, then each path in $XDG_CONFIG_DIRS)
     *  4) legacy root files in CWD: gherklin.config.ts / .yaml / .yml
     */
    fromFile: () => Promise<Config>;
    /**
     * Resolve the path to the config file to use (see "fromFile" for order).
     */
    getConfigFile: () => Promise<string>;
    /**
     * Use cosmiconfig to search for a config in conventional places while
     * walking up the directory tree from CWD.
     */
    private resolveViaCosmiconfig;
    /**
     * Check XDG locations for a global/shared config.
     * - $XDG_CONFIG_HOME/gherklin/gherklin.config.*
     * - each path in $XDG_CONFIG_DIRS
     */
    private resolveViaXdg;
    /**
     * Load the configuration from a resolved file path.
     * Supports:
     *  - .ts / .mts / .cts (ESM default export)
     *  - .yaml / .yml (YAML)
     */
    loadConfigFromFile: (filePath: string) => Promise<GherklinConfiguration>;
    /**
     * Validates that the configuration contains all the necessary
     * information for Gherklin to run.
     */
    validate: () => void;
}
