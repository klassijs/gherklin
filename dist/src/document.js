import fs from 'node:fs/promises';
import path from 'node:path';
import { Feature, IdGenerator } from '@cucumber/messages';
import Gherkin from '@cucumber/gherkin';
import { writeFileSync } from 'node:fs';
import Line from './line.js';
export default class Document {
    filename;
    feature = new Feature();
    path;
    // Definite assignment (!) – set when parseGherkin() runs
    gherkinDocument;
    // Sometimes, we need access to the raw lines since Gherkin has processing
    // to trim line content in the AST
    lines = [];
    errors = [];
    // If true, this document has rule validation disabled
    disabled = false;
    // A list of lines that are disabled by the gherklin-disable-next-line comment
    // Uses a map of line number => array of rules to disable
    linesDisabled = new Map();
    // A list of rules that are disabled by the gherklin-disable rule-name comment
    rulesDisabled = new Map();
    constructor(filePath) {
        this.filename = path.basename(filePath);
        this.path = filePath;
    }
    load = async () => {
        const content = await fs.readFile(this.path).catch(() => {
            throw new Error(`Could not open the feature file at "${this.filename}". Does it exist?`);
        });
        this.parseGherkin(String(content));
        if (!this.gherkinDocument) {
            return;
        }
        const rawLines = String(content).split(/\r\n|\r|\n/);
        rawLines.forEach((line) => {
            this.lines.push(new Line(line));
        });
        this.getDisabledRules();
    };
    parseGherkin = (content) => {
        const builder = new Gherkin.AstBuilder(IdGenerator.uuid());
        const matcher = new Gherkin.GherkinClassicTokenMatcher();
        const parser = new Gherkin.Parser(builder, matcher);
        this.gherkinDocument = parser.parse(content.toString());
        if (this.gherkinDocument.feature) {
            this.feature = this.gherkinDocument.feature;
        }
    };
    addError = (rule, message, location) => {
        // Don't add the error if the line has been disabled
        const disabledLine = this.linesDisabled.get(location.line);
        if (disabledLine) {
            // If the array is empty, we disable all rules
            if (disabledLine.length === 0) {
                return;
            }
            // Specific rule disabled for next line
            if (disabledLine.includes(rule.name)) {
                return;
            }
        }
        // Don't add the error if the rule is disabled via
        // # gherklin-disable rule-name
        if (this.rulesDisabled.get(rule.name) === true) {
            return;
        }
        this.errors.push({
            message,
            location,
            severity: rule.schema.severity,
            rule: rule.name,
        });
    };
    getDisabledRules = () => {
        // Guard in case comments are not present
        this.gherkinDocument?.comments?.forEach((comment) => {
            const text = comment.text.trim();
            if (comment.location.line === 1) {
                if (text === '# gherklin-disable') {
                    this.disabled = true;
                    return;
                }
                const disableRuleMatch = text.match(/^# gherklin-disable ([a-zA-Z0-9-,\s]+)$/);
                if (disableRuleMatch) {
                    const rules = (disableRuleMatch[1] || '').split(',');
                    rules.forEach((rule) => {
                        this.rulesDisabled.set(rule.trim(), true);
                    });
                }
            }
            const disableNextLineMatches = text.match(/#\sgherklin-disable-next-line\s?([a-zA-Z0-9-,\s]+)?/);
            if (disableNextLineMatches && disableNextLineMatches.length) {
                const specificRules = disableNextLineMatches[1];
                this.linesDisabled.set(comment.location.line + 1, specificRules?.split(',').map((r) => r.trim()) ?? []);
            }
        });
    };
    /**
     * Regenerates the file from the lines array, overwriting the existing file
     */
    regenerate = async () => {
        const lines = [];
        this.lines.forEach((l) => {
            let padding = [];
            if (l.indentation > 0) {
                padding = Array(Number(l.indentation)).fill(' ');
            }
            lines.push(padding.join('') + l.keyword + l.text);
        });
        const content = lines.join('\n');
        writeFileSync(this.path, content);
        // Need to regenerate the Gherkin AST since some rules rely on that
        this.parseGherkin(content);
    };
}
