import Schema from '../schema.js';
import Rule from '../rule.js';
import { RawSchema, AcceptedSchema } from '../types.js';
import Document from '../document.js';
/**
 * Custom rule: enforce maximum length for the Feature name/title
 * (the text after "Feature: "). No built-in rule covers this.
 */
export default class FeatureNameLength implements Rule {
    readonly name: string;
    readonly acceptedSchema: AcceptedSchema;
    readonly schema: Schema;
    constructor(rawSchema: RawSchema);
    run(document: Document): Promise<void>;
}
