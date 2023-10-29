function ApiError(statusCode, message, isOperational = true, stack = '') {
	this.statusCode = statusCode;
	this.message = message;
	this.isOperational = isOperational;
	this.success = false;
	if (stack) {
		this.stack = stack;
	} else {
		Error.captureStackTrace(this, this.constructor);
	}
	return this;
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

module.exports = ApiError;

/*class ApiError extends Error {
	constructor(statusCode, message, isOperational = true, stack = '') {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.success = false;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

module.exports = ApiError;
*/
