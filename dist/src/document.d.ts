import { Feature, GherkinDocument } from '@cucumber/messages';
import { LintError, Location } from './types.js';
import Line from './line.js';
import Rule from './rule.js';
export default class Document {
    filename: string;
    feature: Feature;
    path: string;
    gherkinDocument: GherkinDocument;
    lines: Array<Line>;
    errors: Array<LintError>;
    disabled: boolean;
    linesDisabled: Map<number, Array<string>>;
    rulesDisabled: Map<string, boolean>;
    constructor(filePath: string);
    load: () => Promise<void>;
    private parseGherkin;
    addError: (rule: Rule, message: string, location: Location) => void;
    private getDisabledRules;
    /**
     * Regenerates the file from the lines array, overwriting the existing file
     */
    regenerate: () => Promise<void>;
}
