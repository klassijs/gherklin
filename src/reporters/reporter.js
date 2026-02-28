export default class Reporter {
    config;
    constructor(config) {
        this.config = config;
    }
    errors = new Map();
    addErrors(key, errors) {
        if (this.errors.has(key)) {
            this.errors.set(key, [...errors, ...this.errors.get(key)]);
            return;
        }
        this.errors.set(key, errors);
    }
    /**
     * Since errors are grouped under their file name, this is a helper function
     * to return the total number of errors across all files
     */
    errorCount() {
        let count = 0;
        this.errors.forEach((err) => {
            count += err.length;
        });
        return count;
    }
    write = () => { };
}
