// src/config/resolveConfig.ts
import path from 'node:path';
import { existsSync, readdirSync } from 'node:fs';
import { cosmiconfig } from 'cosmiconfig';
const MODULE_NAME = 'gherklin';
// baseline places for cosmiconfig (you already had these)
const BASE_PLACES = [
    'package.json',
    '.gherklinrc', '.gherklinrc.json', '.gherklinrc.yaml', '.gherklinrc.yml',
    '.gherklinrc.js', '.gherklinrc.ts', '.gherklinrc.mjs', '.gherklinrc.cjs',
    'gherklin.config.ts', 'gherklin.config.js', 'gherklin.config.mjs',
    'gherklin.config.cjs', 'gherklin.config.yaml', 'gherklin.config.yml',
    '.config/gherklinrc', '.config/gherklinrc.json', '.config/gherklinrc.yaml',
    '.config/gherklinrc.yml', '.config/gherklinrc.js', '.config/gherklinrc.ts',
    '.config/gherklinrc.mjs', '.config/gherklinrc.cjs',
    '.config/gherklin.config.ts', '.config/gherklin.config.js',
    '.config/gherklin.config.mjs', '.config/gherklin.config.cjs',
    '.config/gherklin.config.yaml', '.config/gherklin.config.yml',
];
// filenames we consider a config in the "any subfolder" pass
const LOOSE_FILENAMES = new Set([
    'gherklin.config.ts',
    'gherklin.config.yaml',
    'gherklin.config.yml',
]);
// default scan parameters (overridable from env or options)
const DEFAULT_MAX_DEPTH = Number.parseInt(process.env.GHERKLIN_MAX_SEARCH_DEPTH || '', 10) || 3;
const DEFAULT_SKIP_DIRS = (process.env.GHERKLIN_SKIP_DIRS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
if (DEFAULT_SKIP_DIRS.length === 0) {
    DEFAULT_SKIP_DIRS.push('node_modules', '.git', 'dist', 'build', '.next', '.cache', '.idea', '.vscode', 'out', 'coverage', 'target');
}
/**
 * Main resolver:
 *   1) explicit path (--config / env)
 *   2) cosmiconfig search (from cwd)
 *   3) "any subfolder" nearest-first BFS for gherklin.config.{ts|yaml|yml} (finds config in any subdirectory)
 *   4) XDG
 *   5) fallback: undefined
 */
export async function resolveConfig(opts = {}) {
    const cwd = path.resolve(opts.cwd ?? process.cwd());
    // 1) explicit path
    const explicit = opts.explicitPath ??
        process.env.GHERKLIN_CONFIG_FILE ??
        process.env.GHERKLIN_CONFIG;
    if (explicit?.trim()) {
        const fp = path.isAbsolute(explicit) ? explicit : path.resolve(cwd, explicit);
        const res = await loadConfigAtPath(fp);
        if (res)
            return res;
        throw new Error(`Gherklin: config file not found or unreadable at: ${fp}`);
    }
    // 2) cosmiconfig search (root, .config/, rc files, package.json) from cwd
    const fromCwd = await searchFromDir(cwd, BASE_PLACES);
    if (fromCwd)
        return fromCwd;
    // 3) "any subfolder" nearest-first BFS at each level up to root (finds config in any subdirectory)
    const maxDepth = opts.maxScanDepth ?? DEFAULT_MAX_DEPTH;
    const skipDirs = opts.skipDirs ?? DEFAULT_SKIP_DIRS;
    const loose = await searchUpLoose(cwd, maxDepth, skipDirs);
    if (loose)
        return loose;
    // 4) XDG (guard with existsSync)
    if (opts.enableXdg !== false) {
        for (const candidate of xdgCandidates()) {
            if (!existsSync(candidate))
                continue;
            const res = await loadConfigAtPath(candidate);
            if (res)
                return res;
        }
    }
    // 5) fallback
    return { filepath: null, config: undefined };
}
async function loadConfigAtPath(fp) {
    const explorer = cosmiconfig(MODULE_NAME);
    const result = await explorer.load(fp);
    if (result && !result.isEmpty) {
        return {
            filepath: result.filepath ?? fp,
            config: result.config ?? undefined,
        };
    }
    return null;
}
async function searchFromDir(dir, places) {
    const explorer = cosmiconfig(MODULE_NAME, {
        mergeSearchPlaces: true,
        searchPlaces: places,
    });
    const found = await explorer.search(dir);
    if (found && !found.isEmpty) {
        return {
            filepath: found.filepath ?? null,
            config: found.config ?? undefined,
        };
    }
    return null;
}
/**
 * Search "loosely" by looking for gherklin.config.{ts|yaml|yml} in ANY subfolder
 * under each path as we walk up to the root—nearest first—and ignoring heavy/system
 * directories. Breadth-first to ensure "nearest" takes precedence.
 */
async function searchUpLoose(start, maxDepth, skipDirs) {
    let dir = path.resolve(start);
    const { root } = path.parse(dir);
    while (true) {
        // 3.1: quick check — if a root-style file is directly under "dir"
        for (const fn of LOOSE_FILENAMES) {
            const tryFile = path.join(dir, fn);
            if (existsSync(tryFile)) {
                const res = await loadConfigAtPath(tryFile);
                if (res)
                    return res;
            }
        }
        // 3.2: BFS within dir for nearest matches in ANY subfolder
        const nearest = await findNearestLooseInDir(dir, maxDepth, skipDirs);
        if (nearest)
            return nearest;
        if (dir === root)
            break;
        dir = path.dirname(dir);
    }
    return null;
}
/**
 * BFS scan inside "dir", up to depth "maxDepth".
 * Skip directories listed in "skipDirs".
 * Stop at the first found config (nearest).
 */
async function findNearestLooseInDir(dir, maxDepth, skipDirs) {
    const q = [];
    const visited = new Set();
    // seed: all immediate subdirs of dir
    enqueueSubdirs(dir, 0);
    function enqueueSubdirs(base, depth) {
        let entries;
        try {
            entries = readdirSync(base, { withFileTypes: true });
        }
        catch {
            return;
        }
        for (const e of entries) {
            if (!e.isDirectory())
                continue;
            if (skipDirs.includes(e.name))
                continue;
            const sub = path.join(base, e.name);
            if (!visited.has(sub)) {
                visited.add(sub);
                q.push({ d: sub, depth });
            }
        }
    }
    while (q.length) {
        const { d, depth } = q.shift();
        // check files at this directory
        for (const fn of LOOSE_FILENAMES) {
            const tryFile = path.join(d, fn);
            if (existsSync(tryFile)) {
                const res = await loadConfigAtPath(tryFile);
                if (res)
                    return res;
            }
        }
        // continue BFS if we can go deeper
        if (depth + 1 <= maxDepth) {
            enqueueSubdirs(d, depth + 1);
        }
    }
    return null;
}
/** Build XDG candidate paths */
function xdgCandidates() {
    const out = [];
    const { XDG_CONFIG_HOME, XDG_CONFIG_DIRS, HOME } = process.env;
    const base = XDG_CONFIG_HOME || (HOME ? path.join(HOME, '.config') : undefined);
    if (base) {
        out.push(path.join(base, 'gherklin/gherklin.config.yaml'), path.join(base, 'gherklin/gherklin.config.yml'), path.join(base, 'gherklin/gherklin.config.ts'), path.join(base, 'gherklin/gherklin.config.js'));
    }
    const dirs = (XDG_CONFIG_DIRS && XDG_CONFIG_DIRS.split(':')) || ['/etc/xdg'];
    for (const d of dirs) {
        out.push(path.join(d, 'gherklin/gherklin.config.yaml'), path.join(d, 'gherklin/gherklin.config.yml'), path.join(d, 'gherklin/gherklin.config.ts'), path.join(d, 'gherklin/gherklin.config.js'));
    }
    return out;
}
//# sourceMappingURL=resolveConfig.js.map