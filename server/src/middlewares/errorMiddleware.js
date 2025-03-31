export const notFoundHandler = (req, res, next) => {
	next();
};

export const errorHandler = (err, req, res, next) => {
	// Log the error for debugging
	console.error(`[${new Date().toISOString()}] Error:`, err);

	// Handle AppError instances
	if (err.isOperational) {
		return res.status(err.statusCode || 400).json({
			status: "fail",
			message: err.message,
			...(err.extra && { details: err.extra }),
		});
	}

	// Handle mongoose validation errors
	if (err.name === "ValidationError") {
		const errors = Object.values(err.errors).map((el) => el.message);
		return res.status(400).json({
			status: "fail",
			message: "Validation failed",
			errors,
		});
	}

	// Handle duplicate field errors
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		const message = `${field} already exists`;
		return res.status(400).json({
			status: "fail",
			message,
		});
	}

	// Handle JWT errors
	if (err.name === "JsonWebTokenError") {
		return res.status(401).json({
			status: "fail",
			message: "Invalid token",
		});
	}

	// Handle token expired error
	if (err.name === "TokenExpiredError") {
		return res.status(401).json({
			status: "fail",
			message: "Token expired",
		});
	}

	// Handle CastError (invalid ID format)
	if (err.name === "CastError") {
		return res.status(400).json({
			status: "fail",
			message: `Invalid ${err.path}: ${err.value}`,
		});
	}

	// Default to 500 server error for unhandled cases
	res.status(500).json({
		status: "error",
		message:
			process.env.NODE_ENV === "development"
				? err.message
				: "Something went wrong!",
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
