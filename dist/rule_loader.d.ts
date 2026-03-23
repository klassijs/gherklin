import Document from './document.js';
import { LintError, RawSchema } from './types.js';
import Config from './config.js';
export default class RuleLoader {
    private config;
    private rules;
    constructor(config: Config);
    load: (ruleName: string, rawSchema: RawSchema, customDir?: string) => Promise<void>;
    validateRules: () => Map<string, Array<string>>;
    runRules: (document: Document) => Promise<Array<LintError>>;
}
