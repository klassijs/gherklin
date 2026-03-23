export type ResolveOptions = {
    /** If provided, load this file directly (highest precedence). */
    explicitPath?: string;
    /** Where to start searching from (defaults to process.cwd()). */
    cwd?: string;
    /** Search XDG config dirs ($XDG_CONFIG_HOME, $XDG_CONFIG_DIRS). Defaults: true */
    enableXdg?: boolean;
    /**
     * Maximum directory depth to descend while scanning arbitrary subfolders
     * at each level (nearest-first). Defaults to 3; override with env:
     *   GHERKLIN_MAX_SEARCH_DEPTH=<n>
     */
    maxScanDepth?: number;
    /**
     * Comma-separated list of directory names to skip while scanning.
     * Defaults to typical heavy/system folders:
     *   node_modules,.git,dist,build,.next,.cache,.idea,.vscode
     * Override via env: GHERKLIN_SKIP_DIRS
     */
    skipDirs?: string[];
};
export type ResolvedConfig<TConfig> = {
    filepath: string | null;
    config: TConfig | undefined;
};
/**
 * Main resolver:
 *   1) explicit path (--config / env)
 *   2) cosmiconfig search (from cwd)
 *   3) "any subfolder" nearest-first BFS for gherklin.config.{ts|yaml|yml} (finds config in any subdirectory)
 *   4) XDG
 *   5) fallback: undefined
 */
export declare function resolveConfig<TConfig = unknown>(opts?: ResolveOptions): Promise<ResolvedConfig<TConfig>>;
