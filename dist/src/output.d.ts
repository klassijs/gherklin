import { LintError } from './types.js';
export interface Results {
    success: boolean;
    errors?: Map<string, Array<LintError>>;
    errorCount: number;
    schemaErrors?: Map<string, Array<string>>;
}
export declare const outputSchemaErrors: (schemaErrors: Map<string, Array<string>>) => void;
