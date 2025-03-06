import { useEffect, useRef } from "react";
import { useUser } from "../../contexts/UserContext";

export default function Errors() {
	const { error, setError } = useUser();

	const divRef = useRef();
	const divClass =
		"position-absolute top-0 end-0 m-5 border bg-light justify-content-center align-items-center d-flex rounded d-none";

	useEffect(() => {
		if (!error) {
			return;
		}

		divRef.current.classList.remove("d-none");

		setTimeout(() => {
			divRef.current.classList.add("d-none");
		}, 3000);
	}, error);

	return (
		<div
			ref={divRef}
			className={divClass}
			style={{ zIndex: 1000, width: 100, height: 50 }}
		>
			<p className="m-0">{error}</p>
		</div>
	);
}
