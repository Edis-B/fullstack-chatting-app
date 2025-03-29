export default function ImageView() {
	return (
		<img
			key={index}
			src={image}
			className="img-fluid rounded me-2 mb-2"
			alt="Post"
			style={{ maxWidth: "100px" }}
		/>
	);
}
