export default function Post() {
	return (
		<div className="post-card">
			<div className="d-flex">
				<img
					src="https://via.placeholder.com/150"
					alt="User"
					className="profile-pic me-3"
				/>
				<div>
					<h6 className="card-title">Jane Doe</h6>
					<p className="text-muted">10 minutes ago</p>
				</div>
			</div>
			<p className="mt-3">
				This is a new post from Jane! <a href="#">#Exciting</a>
			</p>
			<img
				src="https://via.placeholder.com/600x300"
				className="img-fluid mt-3"
				alt="Post Image"
			/>
			<div className="d-flex justify-content-between mt-3">
				<button className="btn btn-outline-primary">Like</button>
				<button className="btn btn-outline-secondary">Comment</button>
			</div>
		</div>
	);
}
