import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

export default function ProtectedRoute({ children }) {
	const { autherized } = useUser();
	if (autherized === null) {
		return children;
	}

	return autherized ? children : <Navigate to="/login" replace />;
}
