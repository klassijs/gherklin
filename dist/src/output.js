import chalk from 'chalk';
import logger from './logger.js';
export const outputSchemaErrors = (schemaErrors) => {
    if (!schemaErrors.size) {
        return;
    }
    logger.error(chalk.redBright('Invalid configuration options specified!\n'));
    schemaErrors.forEach((errs, key) => {
        logger.info(chalk.underline(key));
        errs.forEach((e, idx) => {
            logger.info(chalk.gray(`${idx}) `) + e);
        });
    });
};
//# sourceMappingURL=output.js.map