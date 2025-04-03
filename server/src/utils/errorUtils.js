export class AppError extends Error {
	constructor(message, statusCode = 400, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		Error.captureStackTrace(this, this.constructor);
	}
}

export const catchAsync = (asyncFn) => {
	return async (req, res, next) => {
		try {
			// Await the async operation to properly catch errors
			await asyncFn(req, res, next);
		} catch (error) {
			// Forward to Express error handler
			next(error);
		}
	};
};

export const getErrorMessage = (err) => {
	switch (err.name) {
		case "ValidationError":
			return Object.values(err.errors).at(0).message;
		default:
			return err.message;
	}
};
