import path from 'node:path';
import { outputSchemaErrors } from './output.js';
import { getFiles } from './utils.js';
import Config from './config.js';
import { Severity } from './types.js';
import HTMLReporter from './reporters/html_reporter.js';
import STDOUTReporter from './reporters/stdout_reporter.js';
import JSONReporter from './reporters/json_reporter.js';
import logger from './logger.js';
import chalk from 'chalk';
import NullReporter from './reporters/null_reporter.js';
import RuleLoader from './rule_loader.js';
import Document from './document.js';
export default class Runner {
    gherkinFiles = [];
    config;
    reporters;
    ruleLoader;
    constructor(gherklinConfig) {
        if (gherklinConfig) {
            // If CLI passed an inline config, create a Config from it.
            // (bin/gherklin.ts now injects configDirectory when a file was resolved.)
            this.config = new Config(gherklinConfig);
        }
    }
    init = async () => {
        if (!this.config) {
            // Discover config from file if none was injected
            // (supports .ts/.yaml/.yml + GHERKLIN_CONFIG_FILE alias)
            this.config = await new Config().fromFile();
        }
        // Base directory used to resolve config-relative paths:
        // prefer the config file's folder; otherwise use current working directory.
        const configBase = this.config.configDirectory ?? process.cwd();
        const cwdBase = process.cwd();
        this.ruleLoader = new RuleLoader(this.config);
        this.reporters = this.getReporters();
        // --- Resolve feature sources (files or directory) ------------------------
        const envFiles = process.env.GHERKLIN_FEATURE_FILES;
        const envDir = process.env.GHERKLIN_FEATURE_DIR;
        if (envFiles) {
            // Env-based file list: resolve relative to the current working directory (conventional)
            this.gherkinFiles = envFiles
                .split(',')
                .map(f => f.trim())
                .filter(Boolean)
                .map(f => path.isAbsolute(f) ? f : path.resolve(cwdBase, f));
        }
        else if (this.config.featureFile) {
            // Config-based single file: resolve relative to the config file's directory
            const f = this.config.featureFile;
            this.gherkinFiles = [path.isAbsolute(f) ? f : path.resolve(configBase, f)];
        }
        else if (envDir) {
            // Env-based directory: resolve relative to cwd (conventional)
            const dir = path.isAbsolute(envDir) ? envDir : path.resolve(cwdBase, envDir);
            this.gherkinFiles = await getFiles(dir, 'feature');
        }
        else if (this.config.featureDirectory) {
            // Config-based directory: resolve relative to the config file's directory
            const dir = this.config.featureDirectory;
            const abs = path.isAbsolute(dir) ? dir : path.resolve(configBase, dir);
            this.gherkinFiles = await getFiles(abs, 'feature');
        }
        else {
            // Should be prevented by Config.validate(), but keep a friendly error
            throw new Error('No feature source provided (featureDirectory/featureFile or GHERKLIN_FEATURE_DIR/FILES).');
        }
        // ------------------------------------------------------------------------
        // Import and validate all default/custom rules based on config
        if (this.config.rules) {
            for (const ruleName of Object.keys(this.config.rules)) {
                await this.ruleLoader.load(ruleName, this.config.rules[ruleName], this.config.customRulesDirectory);
                const schemaErrors = this.ruleLoader.validateRules();
                if (schemaErrors.size) {
                    outputSchemaErrors(schemaErrors);
                    return {
                        success: false,
                        schemaErrors,
                        errorCount: 0,
                        errors: new Map(),
                    };
                }
            }
        }
        return {
            success: true,
            schemaErrors: new Map(),
            errorCount: 0,
            errors: new Map(),
        };
    };
    run = async () => {
        for (const filename of this.gherkinFiles) {
            const document = new Document(filename);
            await document.load();
            const ruleErrors = await this.ruleLoader.runRules(document);
            if (ruleErrors && ruleErrors.length) {
                for (const r of this.reporters)
                    r.addErrors(filename, ruleErrors);
            }
        }
        const primary = this.reporters[0];
        if (primary.errors.size) {
            const maxAllowedErrors = this.config.maxErrors ?? 0;
            let allWarns = true;
            for (const key of primary.errors.keys()) {
                const errors = primary.errors.get(key) ?? [];
                const hasErrorSeverity = errors.some(err => err.severity === Severity.error);
                if (hasErrorSeverity) {
                    allWarns = false;
                    break;
                }
            }
            const totalErrorCount = primary.errorCount();
            const success = allWarns === true || totalErrorCount <= maxAllowedErrors;
            for (const r of this.reporters)
                r.write();
            return {
                success,
                errors: primary.errors,
                errorCount: totalErrorCount,
                schemaErrors: new Map(),
            };
        }
        if (this.reporters.some(r => !(r instanceof NullReporter))) {
            logger.info(chalk.green('✓ Gherklin found no errors!'));
        }
        return {
            success: true,
            errors: new Map(),
            errorCount: 0,
            schemaErrors: new Map(),
        };
    };
    getReporters() {
        const raw = this.config?.reporter;
        const configs = Array.isArray(raw)
            ? raw
            : raw != null
                ? [raw]
                : [{ type: 'stdout', configDirectory: this.config.configDirectory ?? process.cwd() }];
        const baseDir = this.config.configDirectory ?? process.cwd();
        return configs.map((reporterConfig) => {
            const merged = {
                ...reporterConfig,
                configDirectory: reporterConfig.configDirectory ?? baseDir,
            };
            if (merged.outFile && !path.isAbsolute(merged.outFile)) {
                merged.outFile = path.resolve(process.cwd(), merged.outFile);
            }
            switch (merged.type) {
                case 'html':
                    return new HTMLReporter(merged);
                case 'json':
                    return new JSONReporter(merged);
                case 'null':
                    return new NullReporter(merged);
                case 'stdout':
                default:
                    return new STDOUTReporter(merged);
            }
        });
    }
}
//# sourceMappingURL=runner.js.map