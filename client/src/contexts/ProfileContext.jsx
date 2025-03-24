import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
	const [profileId, setProfileId] = useState(null);
	const [editActive, setEditActive] = useState(false);
	const [profileData, setProfileData] = useState({});

	return (
		<ProfileContext.Provider
			value={{ profileId, setProfileId, editActive, setEditActive, profileData, setProfileData }}
		>
			{children}
		</ProfileContext.Provider>
	);
}

export function useProfile() {
	return useContext(ProfileContext);
}
