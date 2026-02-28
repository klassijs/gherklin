import type { ReporterConfig, LintError } from '../types.js'

export default abstract class Reporter {
    protected config: ReporterConfig
    public errors: Map<string, LintError[]> = new Map()

    constructor(config?: ReporterConfig) {
        // Provide a robust default; adjust fields to match your ReporterConfig shape
        this.config = {
            type: 'stdout',                     // default reporter type
            configDirectory: process.cwd(),     // fallback directory
            ...(config ?? {}),                  // override with user-supplied fields
        } as ReporterConfig
    }

    /**
     * Adds lint errors for a file, merging with any existing ones.
     */
    public addErrors(key: string, errors?: LintError[]) {
        const prev = this.errors.get(key) ?? []
        const next = [...(errors ?? []), ...prev]
        this.errors.set(key, next)
    }

    /**
     * Number of collected errors across all files.
     */
    public errorCount(): number {
        let count = 0
        for (const list of this.errors.values()) count += list.length
        return count
    }

    /**
     * Implemented by concrete reporters (stdout/html/json/null).
     */
    public abstract write(): void
}
