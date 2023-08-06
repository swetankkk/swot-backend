const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env === 'test') {
	transport
		.verify()
		.then(() => logger.info('Email transport is ready'))
		.catch((error) => logger.error('Error on email transport', error));
}

const sendEmail = async (to, subject, text) => {
	const msg = { from: config.email.from, to, subject, text };
	await transport.sendMail(msg);
};

const sendVerificationEmail = async (to, token) => {
	const subject = 'Verify your email';
	const template = `<p>Click <a href="${config.appUrl}/verify-email?token=${token}">here</a> to verify your email</p>`;
	await sendEmail(to, subject, template);
};

module.exports = {
	transport,
	sendVerificationEmail,
};
