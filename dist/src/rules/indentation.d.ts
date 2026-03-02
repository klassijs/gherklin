import Schema from '../schema.js';
import Rule from '../rule.js';
import { RawSchema, AcceptedSchema } from '../types.js';
import Document from '../document.js';
export default class Indentation implements Rule {
    readonly name: string;
    readonly acceptedSchema: AcceptedSchema;
    readonly schema: Schema;
    constructor(rawSchema: RawSchema);
    /**
     * Parser columns are 1-based; config uses 0-based (0 = first column, no spaces).
     */
    private col0;
    run(document: Document): Promise<void>;
    fix(document: Document): Promise<void>;
}
