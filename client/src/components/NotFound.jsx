export default function NotFound() {
	return (
		<div className="container-fluid not-found-container">
			<h1>404</h1>
			<h2>Oops! Page Not Found</h2>
			<p>
				The page you're looking for doesn't exist. It may have been
				moved or deleted.
			</p>
			<a href="/" className="btn btn-primary mt-3">
				Go to Homepage
			</a>
		</div>
	);
}
