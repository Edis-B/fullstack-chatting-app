import Friends from "./Friends";
import ProfileHeader from "./ProfileHeader.jsx"
import { ProfileProvider, useProfile } from "../../contexts/ProfileContext.jsx";

export default function Profile() {


	return (
		<ProfileProvider>
			<div className="container mt-3">
				<ProfileHeader></ProfileHeader>

				<Friends />
			</div>
		</ProfileProvider>
	);
}
