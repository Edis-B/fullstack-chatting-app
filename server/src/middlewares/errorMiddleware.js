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
			success: false, // Added success: false
			message: err.message,
			extraProps: err.extraProps,
			...(err.extra && { details: err.extra }),
		});
	}

	// Handle duplicate field errors
	if (err.code === 11000) {
		const field = Object.keys(err.keyValue)[0];
		const message = `${field} already exists`;
		return res.status(400).json({
			status: "fail",
			success: false, // Added success: false
			message,
		});
	}

	// Handle CastError (invalid ID format)
	if (err.name === "CastError") {
		return res.status(400).json({
			status: "fail",
			success: false, // Added success: false
			message: `Invalid ${err.path}: ${err.value}`,
		});
	}

	// Default to 500 server error for unhandled cases
	res.status(500).json({
		status: "error",
		success: false, // Added success: false
		message:
			process.env.NODE_ENV === "development"
				? err.message
				: "Something went wrong!",
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};
