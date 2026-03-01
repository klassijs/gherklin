import chalk from 'chalk';
import Reporter from './reporter.js';
import logger from '../logger.js';
export default class STDOUTReporter extends Reporter {
    write = () => {
        chalk.level = 2;
        if (!this.errors.size) {
            return;
        }
        let totalErrors = 0;
        let totalWarns = 0;
        this.errors.forEach((lintErrors, file) => {
            let output = `\n${chalk.underline(file)}`;
            lintErrors.forEach((err) => {
                let color = chalk.yellow;
                if (err.severity === 'error') {
                    color = chalk.redBright;
                    totalErrors += 1;
                }
                if (err.severity === 'warn') {
                    totalWarns += 1;
                }
                const errorWithLongestMessage = lintErrors.reduce((a, b) => (a.message.length < b.message.length ? b : a));
                const errorWithLongestLocation = lintErrors.reduce((a, b) => (a.location.column || 0).toString().length + a.location.line.toString().length <
                    (b.location.column || 0).toString().length + b.location.line.toString().length
                    ? b
                    : a);
                const maxMessageLength = errorWithLongestMessage.message.length;
                const maxLocationLength = (errorWithLongestLocation.location.column || 0).toString().length +
                    errorWithLongestLocation.location.line.toString().length;
                const location = (err.location.line + ':' + (err.location.column || 0)).toString().padEnd(maxLocationLength + 1);
                output += [
                    '\n',
                    `${location} ${color(err.severity).padEnd(5)} `,
                    err.message.padEnd(maxMessageLength + 1),
                    chalk.gray(err.rule),
                ].join('');
            });
            logger.error(output);
        });
        if (totalErrors + totalWarns > 0) {
            let color = chalk.bold.redBright;
            if (!totalErrors) {
                color = chalk.bold.yellow;
            }
            logger.info(color(`\n${totalErrors + totalWarns} problems (${totalErrors} error${totalErrors > 1 || totalErrors === 0 ? 's' : ''}, ${totalWarns} warning${totalWarns > 1 || totalWarns === 0 ? 's' : ''})`));
        }
    };
}
//# sourceMappingURL=stdout_reporter.js.map