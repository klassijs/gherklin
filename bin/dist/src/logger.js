import winston, { format } from 'winston';
const { printf, colorize, combine } = format;
const simpleWithoutPrefix = printf((info) => {
    return info.message;
});
const logger = () => {
    return winston.createLogger({
        level: 'info',
        format: combine(colorize(), simpleWithoutPrefix),
        transports: new winston.transports.Console(),
    });
};
export default logger();
