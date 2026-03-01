export function parseArgs(argv) {
    const args = { rest: [] };
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
                args.rest.push(a);
        }
    }
    return args;
}
export function printHelp() {
    // Keep it compact; README will have full docs
    console.log(`
Usage: gherklin [options]

Options:
  -c, --config <path>   Load config file from an explicit path
      --cwd <dir>       Start config discovery from this directory
      --no-xdg          Disable XDG-based global search
  -h, --help            Show this help
  -v, --version         Print version
`);
}
