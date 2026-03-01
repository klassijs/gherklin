import { writeFileSync } from 'node:fs';
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
        writeFileSync(path.join(this.config.configDirectory, this.config.outFile || 'gherklin-report.json'), json, {
            flag: 'w',
        });
    };
}
//# sourceMappingURL=json_reporter.js.map