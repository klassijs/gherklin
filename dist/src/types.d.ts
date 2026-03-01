import { z } from 'zod';
export interface ReporterConfig {
    type?: string;
    title?: string;
    configDirectory: string;
    outFile?: string;
}
export interface GherkinKeywordNumericals {
    feature?: number;
    background?: number;
    scenario?: number;
    step?: number;
    examples?: number;
    given?: number;
    when?: number;
    then?: number;
    and?: number;
    but?: number;
    exampleTableHeader?: number;
    exampleTableBody?: number;
    dataTable?: number;
    featureTag?: number;
    scenarioTag?: number;
}
export declare enum Switch {
    off = "off",
    on = "on"
}
export declare enum Severity {
    warn = "warn",
    error = "error"
}
export type RawSchema = Severity | Switch | GherkinKeywordNumericals | Array<string> | [string, GherkinKeywordNumericals | Array<string> | number] | number;
export type AcceptedSchema = z.ZodSchema;
export interface Location {
    line: number;
    column?: number;
}
export type RuleArguments = GherkinKeywordNumericals | Array<string> | number;
export interface RuleConfiguration {
    [ruleName: string]: RawSchema;
}
export interface GherklinConfiguration {
    configDirectory?: string;
    customRulesDirectory?: string;
    featureDirectory?: string;
    maxErrors?: number;
    rules?: RuleConfiguration;
    reporter?: ReporterConfig;
    featureFile?: string;
    fix?: boolean;
}
export interface Report {
    title: string;
    files: Array<ReportFile>;
    totalErrors: number;
    totalWarns: number;
    totalLines: number;
    rules: {
        [name: string]: number;
    };
}
export interface ReportFile {
    path: string;
    hasErrors: boolean;
    lines: Array<ReportLine>;
    issueCount: number;
}
export interface ReportLine {
    number: number;
    hasError: boolean;
    errorSeverity: Severity;
    content: string;
    ruleName: string;
}
export interface LintError {
    rule: string;
    severity: Severity;
    message: string;
    location: Location;
}
