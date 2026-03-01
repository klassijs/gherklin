import Schema from '../schema.js';
import Rule from '../rule.js';
import { RawSchema, AcceptedSchema } from '../types.js';
import Document from '../document.js';
export default class Indentation implements Rule {
    readonly name: string;
    readonly acceptedSchema: AcceptedSchema;
    readonly schema: Schema;
    constructor(rawSchema: RawSchema);
    run(document: Document): Promise<void>;
    fix(document: Document): Promise<void>;
}
