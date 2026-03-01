import { z } from 'zod';
import { RawSchema, RuleArguments, Severity } from './types.js';
export default class Schema {
    private readonly rawSchema;
    severity: Severity;
    args?: RuleArguments;
    enabled: boolean;
    constructor(rawSchema: RawSchema);
    private parse;
    validate(zodSchema: z.ZodSchema): Array<string>;
}
