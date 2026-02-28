export default class Reporter {
    config;
    errors = new Map();
    constructor(config) {
        // Provide a robust default; adjust fields to match your ReporterConfig shape
        this.config = {
            type: 'stdout', // default reporter type
            configDirectory: process.cwd(), // fallback directory
            ...(config ?? {}), // override with user-supplied fields
        };
    }
    /**
     * Adds lint errors for a file, merging with any existing ones.
     */
    addErrors(key, errors) {
        const prev = this.errors.get(key) ?? [];
        const next = [...(errors ?? []), ...prev];
        this.errors.set(key, next);
    }
    /**
     * Number of collected errors across all files.
     */
    errorCount() {
        let count = 0;
        for (const list of this.errors.values())
            count += list.length;
        return count;
    }
}
