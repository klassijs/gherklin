import { Results } from './output.js';
import { GherklinConfiguration } from './types.js';
import Reporter from './reporters/reporter.js';
export default class Runner {
    gherkinFiles: string[];
    private config;
    private reporters;
    private ruleLoader;
    constructor(gherklinConfig?: GherklinConfiguration);
    init: () => Promise<Results>;
    run: () => Promise<Results>;
    getReporters(): Reporter[];
}
