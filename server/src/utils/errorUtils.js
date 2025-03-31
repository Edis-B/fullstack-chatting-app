export class AppError extends Error {
	constructor(message, statusCode = 400, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		Error.captureStackTrace(this, this.constructor);
	}
}


export const catchAsync = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};


export const getErrorMessage = (err) => {
	switch (err.name) {
		case "ValidationError":
			return Object.values(err.errors).at(0).message;
		default:
			return err.message;
	}
};
