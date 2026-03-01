import { AcceptedSchema } from './types.js';
import Schema from './schema.js';
import Document from './document.js';
export default abstract class Rule {
    readonly name: string;
    readonly acceptedSchema: AcceptedSchema;
    readonly schema: Schema;
    protected constructor(name: string, acceptedSchema: AcceptedSchema, schema: Schema);
    abstract run(document: Document): Promise<void>;
    abstract fix?(document: Document): Promise<void>;
}
