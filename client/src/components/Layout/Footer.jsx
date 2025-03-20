export default function Footer() {
	return (
		<footer className="bg-dark text-light py-4 mt-1">
			<div className="container">
				<div className="row">
					{/* About Section */}
					<div className="col-md-4">
						<h5>About Socialize</h5>
						<p>
							Socialize is a platform to connect with friends,
							share moments, and discover new communities. Join us
							today!
						</p>
					</div>

					{/* Social Media Links */}
					<div className="col-md-4">
						<h5>Follow Us</h5>
						<div className="d-flex gap-3">
							<a href="#" className="text-light">
								<i className="bi bi-facebook fs-4"></i>
							</a>
							<a href="#" className="text-light">
								<i className="bi bi-twitter fs-4"></i>
							</a>
							<a href="#" className="text-light">
								<i className="bi bi-instagram fs-4"></i>
							</a>
							<a href="#" className="text-light">
								<i className="bi bi-linkedin fs-4"></i>
							</a>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="text-center mt-4">
					<p className="mb-0">
						© 2025 Socialize. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
