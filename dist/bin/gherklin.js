#!/usr/bin/env node
// ... your CLI code that imports from "gherklin" (which now points to dist)
import fs from 'node:fs';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveConfig } from '../src/config/resolveConfig.js';
// NOTE: adjust this import if Runner is exported from a different module in your fork
import { Runner } from '../src/index.js';
function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        switch (a) {
            case '--config':
            case '-c':
                args.config = argv[++i];
                break;
            case '--cwd':
                args.cwd = argv[++i];
                break;
            case '--no-xdg':
                args.noXdg = true;
                break;
            case '--help':
            case '-h':
                args.help = true;
                break;
            case '--version':
            case '-v':
                args.version = true;
                break;
            default:
                // ignore positional for now
                break;
        }
    }
    return args;
}
function printHelp() {
    console.log(`
Usage: gherklin [options]

Options:
  -c, --config <path>   Load config file from explicit path
      --cwd <dir>       Start search from this directory (monorepos)
      --no-xdg          Disable XDG lookups
  -h, --help            Show this help
  -v, --version         Print version
`);
}
async function main() {
    // const args = parseArgs(process.argv.slice(2));
    const args = parseArgs(process.argv.slice(2));
    // If a working directory is specified, switch to it immediately.
    if (args.cwd) {
        const targetCwd = path.isAbsolute(args.cwd)
            ? args.cwd
            : path.resolve(process.cwd(), args.cwd); // robust absolute path
        if (!fs.existsSync(targetCwd) || !fs.statSync(targetCwd).isDirectory()) {
            console.error(`\n✖ The --cwd path does not exist or is not a directory:\n   ${targetCwd}\n\n` +
                `Tips:\n` +
                `  • Use an absolute path, or a path relative to the directory you run the CLI from.\n` +
                `  • Example: --cwd ./packages/app\n`);
            process.exit(2);
        }
        try {
            process.chdir(targetCwd);
        }
        catch (err) {
            console.error(`\n✖ Failed to change directory to:\n   ${targetCwd}\n\n${err?.message || err}\n`);
            process.exit(2);
        }
    }
    if (args.help) {
        printHelp();
        process.exit(0);
    }
    if (args.version) {
        const here = dirname(fileURLToPath(import.meta.url));
        const pkg = JSON.parse(readFileSync(resolvePath(here, '..', 'package.json'), 'utf8'));
        console.log(pkg.version);
        process.exit(0);
    }
    const { config, filepath } = await resolveConfig({
        enableXdg: !args.noXdg,
        explicitPath: args.config
    });
    if (!config) {
        console.error('No Gherklin config found. Add a gherklin.config.yaml (or .ts/.yml) in the project root or pass --config <path>.');
        process.exit(2);
    }
    const configWithDir = filepath
        ? { ...config, configDirectory: path.dirname(filepath) }
        : config;
    const runner = new Runner(configWithDir);
    const init = await runner.init();
    if (!init.success) {
        console.error('Invalid Gherklin configuration:');
        console.error(init.schemaErrors);
        process.exit(2);
    }
    const result = await runner.run();
    process.exit(result.success ? 0 : 1);
}
main().catch((e) => {
    console.error(e?.stack || e?.message || e);
    process.exit(1);
});
//# sourceMappingURL=gherklin.js.map