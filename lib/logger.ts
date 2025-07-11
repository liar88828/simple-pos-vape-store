import winston from 'winston';

const { combine, timestamp, json, colorize, printf } = winston.format;

const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp(),
        json() // For file output
    ),
    transports: [
        // Write logs to a file
        // new winston.transports.File({
        //     filename: "app.log"
        // }),

        // Show logs in terminal
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                printf(({ level, message, timestamp }) => {
                    return `[${ timestamp }] ${ level }: ${ message }`;
                })
            )
        }),
    ],
    silent: false,
});

export { logger };
