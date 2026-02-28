import { AcceptedSchema } from './types.js'
import Schema from './schema.js'
import Document from './document.js'

export default abstract class Rule {
    public readonly name: string
    public readonly acceptedSchema: AcceptedSchema
    public readonly schema: Schema

    protected constructor(
        name: string,
        acceptedSchema: AcceptedSchema,
        schema: Schema,
    ) {
        this.name = name
        this.acceptedSchema = acceptedSchema
        this.schema = schema
    }

    public abstract run(document: Document): Promise<void>
    public abstract fix?(document: Document): Promise<void>
}
