import { useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserContext";

export default function Errors() {
	const { error, setError } = useUser();

	const divRef = useRef();

	useEffect(() => {
		if (!error) {
			return;
		}

		divRef.current.style.display = "flex";

		setTimeout(() => {
			divRef.current.style.display = "none";
		}, 3000);
	}, error);

	return (
		<div
			ref={divRef}
			className="error-container"
			style={{ zIndex: 1000, width: 100, height: 50 }}
		>
			<p className="m-0">{error}</p>
		</div>
	);
}
