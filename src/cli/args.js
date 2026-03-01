"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseArgs = parseArgs;
exports.printHelp = printHelp;
function parseArgs(argv) {
    var args = { rest: [] };
    for (var i = 0; i < argv.length; i++) {
        var a = argv[i];
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
function printHelp() {
    // Keep it compact; README will have full docs
    console.log("\nUsage: gherklin [options]\n\nOptions:\n  -c, --config <path>   Load config file from an explicit path\n      --cwd <dir>       Start config discovery from this directory\n      --no-xdg          Disable XDG-based global search\n  -h, --help            Show this help\n  -v, --version         Print version\n");
}
