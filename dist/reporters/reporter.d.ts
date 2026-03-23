import type { ReporterConfig, LintError } from '../types.js';
export default abstract class Reporter {
    protected config: ReporterConfig;
    errors: Map<string, LintError[]>;
    constructor(config?: ReporterConfig);
    /**
     * Adds lint errors for a file, merging with any existing ones.
     */
    addErrors(key: string, errors?: LintError[]): void;
    /**
     * Number of collected errors across all files.
     */
    errorCount(): number;
    /**
     * Implemented by concrete reporters (stdout/html/json/null).
     */
    abstract write(): void;
}
