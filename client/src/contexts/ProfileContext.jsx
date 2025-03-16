import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
	const [profileId, setProfileId] = useState(null);
	const [editActive, setEditActive] = useState(false);

	return (
		<ProfileContext.Provider
			value={{ profileId, setProfileId, editActive, setEditActive }}
		>
			{children}
		</ProfileContext.Provider>
	);
}

export function useProfile() {
	return useContext(ProfileContext);
}
