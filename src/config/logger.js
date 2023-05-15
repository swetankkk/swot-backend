const winston = require('winston');
const { format, transports, createLogger } = winston;
const consoleloggerLevel = process.env.WINSTON_LOGGER_LEVEL || 'info';
const path = require('path');

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp(),
		format.label({ label: path.basename(process.mainModule.filename) }),
		format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
		format.json()
	),
	transports: [
		//
		// - Write to all logs with level `info` and below to `combined.log`
		// - Write all logs error (and below) to `error.log`.
		//
		new transports.File({ filename: 'error.log', level: 'error' }),
		new transports.File({ filename: 'combined.log' }),
	],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new transports.Console({
			level: consoleloggerLevel,
			format: format.combine(
				format.colorize(),
				format.timestamp(),
				format.align(),
				format.printf((info) => {
					return `${info.timestamp} - ${info.level}:  [${info.label}]: ${
						info.message
					} ${JSON.stringify(info.metadata)}`;
				})
			),
		})
	);
}

logger.stream = {
	write: (message) => {
		logger.info(message.trim());
	},
};

const logHelper = {
	log: logger.info.bind(logger),
};
module.exports = logger;
