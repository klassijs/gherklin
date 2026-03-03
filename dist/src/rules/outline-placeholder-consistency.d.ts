import Schema from '../schema.js';
import Rule from '../rule.js';
import { RawSchema, AcceptedSchema } from '../types.js';
import Document from '../document.js';
export default class OutlinePlaceholderConsistency implements Rule {
    readonly name: string;
    readonly acceptedSchema: AcceptedSchema;
    readonly schema: Schema;
    constructor(rawSchema: RawSchema);
    run(document: Document): Promise<void>;
}
