import { switchOrSeveritySchema } from '../schemas.js';
import Schema from '../schema.js';
export default class BackgroundSetupOnly {
    name = 'background-setup-only';
    acceptedSchema = switchOrSeveritySchema;
    schema;
    constructor(rawSchema) {
        this.schema = new Schema(rawSchema);
    }
    async run(document) {
        document.feature.children.forEach((child) => {
            if (!child.background) {
                return;
            }
            child.background.steps.forEach((step) => {
                if (!['Given', '*'].includes(step.keyword.trim())) {
                    document.addError(this, `Background should only be used for set up. Found "${step.keyword.trim()}".`, step.location);
                }
            });
        });
    }
}
