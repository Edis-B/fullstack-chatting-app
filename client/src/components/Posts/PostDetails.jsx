async function PostDetails() {
	return (
		<div className="post-container">
			{/* Post Header */}
			<div className="d-flex align-items-center mb-4">
				<img
					src="https://via.placeholder.com/50"
					alt="User Avatar"
					className="rounded-circle me-3"
					style={{
						width: "50px",
						height: "50px",
						objectFit: "cover",
					}}
				/>
				<div>
					<h5 className="mb-0">John Doe</h5>
					<small className="text-muted">2 hours ago</small>
				</div>
			</div>

			{/* Post Content */}
			<div className="mb-4">
				<p>
					This is the post content. Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Nulla vel purus at libero
					tincidunt tincidunt. Donec euismod, nisl eget consectetur
					tincidunt, nisl nunc consectetur nunc, eget consectetur nunc
					nisl eget consectetur nunc.
				</p>
			</div>

			{/* Post Images */}
			<div className="row mb-4">
				<div className="col-md-6">
					<img
						src="https://via.placeholder.com/400x300"
						alt="Post Image 1"
						className="post-image"
					/>
				</div>
				<div className="col-md-6">
					<img
						src="https://via.placeholder.com/400x300"
						alt="Post Image 2"
						className="post-image"
					/>
				</div>
			</div>

			{/* Post Likes */}
			<div className="d-flex align-items-center mb-4">
				<button className="btn btn-outline-primary me-2">
					<i className="fas fa-thumbs-up"></i> Like
				</button>
				<span className="text-muted">10 likes</span>
			</div>

			{/* Comments Section */}
			<div className="comment-section">
				<h5>Comments</h5>

				{/* Comment 1 */}
				<div className="comment">
					<div className="d-flex align-items-center">
						<img
							src="https://via.placeholder.com/40"
							alt="Commenter Avatar"
							className="rounded-circle me-3"
							style={{
								width: "40px",
								height: "40px",
								objectFit: "cover",
							}}
						/>
						<div>
							<h6 className="mb-0">Jane Doe</h6>
							<small className="text-muted">1 hour ago</small>
						</div>
					</div>
					<p className="mt-2">This is a comment on the post.</p>
				</div>

				{/* Comment 2 */}
				<div className="comment">
					<div className="d-flex align-items-center">
						<img
							src="https://via.placeholder.com/40"
							alt="Commenter Avatar"
							className="rounded-circle me-3"
							style={{
								width: "40px",
								height: "40px",
								objectFit: "cover",
							}}
						/>
						<div>
							<h6 className="mb-0">John Smith</h6>
							<small className="text-muted">30 minutes ago</small>
						</div>
					</div>
					<p className="mt-2">Another comment here.</p>
				</div>

				{/* Add Comment Form */}
				<form className="mt-4">
					<div className="mb-3">
						<textarea
							className="form-control"
							rows="3"
							placeholder="Add a comment..."
						></textarea>
					</div>
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}
