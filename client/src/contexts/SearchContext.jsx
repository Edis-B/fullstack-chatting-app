import { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
	const [queryParameters, setQueryParameters] = useState({});
	const [content, setContent] = useState(null);

	return (
		<SearchContext.Provider
			value={{ queryParameters, setQueryParameters, content, setContent }}
		>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearch() {
	return useContext(SearchContext);
}
