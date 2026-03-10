import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import Reporter from './reporter.js';
import logger from '../logger.js';
export default class JSONReporter extends Reporter {
    write = () => {
        const json = JSON.stringify(Object.fromEntries(this.errors), null, 2);
        if (!this.config.outFile) {
            logger.info(json);
            return;
        }
        const outDir = this.config.configDirectory ?? process.cwd();
        const filePath = path.isAbsolute(this.config.outFile)
            ? this.config.outFile
            : path.join(outDir, this.config.outFile);
        mkdirSync(path.dirname(filePath), { recursive: true });
        writeFileSync(filePath, json, { flag: 'w' });
    };
}
//# sourceMappingURL=json_reporter.js.map