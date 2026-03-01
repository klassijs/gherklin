export type CliArgs = {
    config?: string;
    cwd?: string;
    noXdg?: boolean;
    help?: boolean;
    version?: boolean;
    /** passthrough for future flags, e.g., --reporter, etc. */
    rest: string[];
};
export declare function parseArgs(argv: string[]): CliArgs;
export declare function printHelp(): void;
