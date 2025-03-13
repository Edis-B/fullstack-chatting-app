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
	}, [error]);

	return (
		<div
			ref={divRef}
			className="error-container"
		>
			<p className="m-0">{error}</p>
		</div>
	);
}
