import path from 'node:path';
import { outputSchemaErrors } from './output';
import { getFiles } from './utils';
import Config from './config';
import { Severity } from './types';
import HTMLReporter from './reporters/html_reporter';
import STDOUTReporter from './reporters/stdout_reporter';
import JSONReporter from './reporters/json_reporter';
import logger from './logger';
import chalk from 'chalk';
import NullReporter from './reporters/null_reporter';
import RuleLoader from './rule_loader';
import Document from './document';
export default class Runner {
    gherkinFiles = [];
    config;
    reporter;
    ruleLoader;
    constructor(gherklinConfig) {
        if (gherklinConfig) {
            this.config = new Config(gherklinConfig);
        }
    }
    init = async () => {
        if (!this.config) {
            // This now discovers .ts/.yaml/.yml and respects GHERKLIN_CONFIG_FILE
            this.config = await new Config().fromFile();
        }
        const baseDir = this.config.configDirectory ?? process.cwd();
        this.ruleLoader = new RuleLoader(this.config);
        this.reporter = this.getReporter();
        const envFiles = process.env.GHERKLIN_FEATURE_FILES;
        const envDir = process.env.GHERKLIN_FEATURE_DIR;
        if (envFiles) {
            this.gherkinFiles = envFiles.split(',').map(f => path.resolve(baseDir, f.trim()));
        }
        else if (this.config.featureFile) {
            this.gherkinFiles = [path.resolve(baseDir, this.config.featureFile)];
        }
        else if (envDir) {
            this.gherkinFiles = await getFiles(path.resolve(baseDir, envDir), 'feature');
        }
        else if (this.config.featureDirectory) {
            this.gherkinFiles = await getFiles(path.resolve(baseDir, this.config.featureDirectory), 'feature');
        }
        else {
            // Should be prevented by Config.validate(), but keep a friendly error
            throw new Error('No feature source provided (featureDirectory/featureFile or GHERKLIN_FEATURE_DIR/FILES).');
        }
        // Import and validate all default rules
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
                this.reporter.addErrors(filename, ruleErrors);
            }
        }
        if (this.reporter.errors.size) {
            const maxAllowedErrors = this.config.maxErrors ?? 0;
            let allWarns = true;
            for (const key of this.reporter.errors.keys()) {
                const errors = this.reporter.errors.get(key) ?? [];
                const hasErrorSeverity = errors.some(err => err.severity === Severity.error);
                if (hasErrorSeverity) {
                    allWarns = false;
                    break;
                }
            }
            const totalErrorCount = this.reporter.errorCount();
            const success = allWarns === true || totalErrorCount <= maxAllowedErrors;
            this.reporter.write();
            return {
                success,
                errors: this.reporter.errors,
                errorCount: totalErrorCount,
                schemaErrors: new Map(),
            };
        }
        if (!(this.reporter instanceof NullReporter)) {
            logger.info(chalk.green('✓ Gherklin found no errors!'));
        }
        return {
            success: true,
            errors: new Map(),
            errorCount: 0,
            schemaErrors: new Map(),
        };
    };
    getReporter() {
        const reporterConfig = Object.assign({}, this.config?.reporter, {
            configDirectory: this.config.configDirectory,
        });
        switch (reporterConfig.type) {
            case 'html':
                return new HTMLReporter(reporterConfig);
            case 'json':
                return new JSONReporter(reporterConfig);
            case 'null':
                return new NullReporter(reporterConfig);
            case 'stdout':
            default:
                return new STDOUTReporter(reporterConfig);
        }
    }
}
