import { useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserContext";

export default function Errors() {
	const { errors, setErrors } = useUser();

	// Ensure each error has a unique ID
	const errorsWithId = errors?.map((error, index) => ({
		id: error.id || `error-${Date.now()}-${index}`, // Generate unique id if missing
		message: error.message || error, // Support both strings and objects
	}));

	useEffect(() => {
		if (!errorsWithId || errorsWithId.length === 0) {
			return;
		}

		// Display errors for 3 seconds and then remove them
		const timers = errorsWithId.map((_, index) => {
			return setTimeout(() => {
				setErrors((prevErrors) =>
					prevErrors.filter((_, i) => i !== index)
				);
			}, 3000); // Remove error after 3 seconds
		});

		// Cleanup timers on unmount
		return () => {
			timers.forEach((timer) => clearTimeout(timer));
		};
	}, [errorsWithId, setErrors]);

	return (
		<div className="error-container">
			{errorsWithId?.map((error) => (
				<div key={error.id} className="error-box">
					<p className="m-0">{error.message}</p>
				</div>
			))}
		</div>
	);
}
