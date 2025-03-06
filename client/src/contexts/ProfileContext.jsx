import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
	const [profileId, setProfileId] = useState(null);

	return (
		<ProfileContext.Provider value={{ profileId, setProfileId }}>
			{children}
		</ProfileContext.Provider>
	);
}

export function useProfile() {
	return useContext(ProfileContext);
}
