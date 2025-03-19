import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const SearchContext = createContext();

export function SearchProvider({ children }) {
	const [queryParameters, setQueryParameters] = useState({});
	const [content, setContent] = useState(null);

	const [searchParams] = useSearchParams();

	useEffect(() => {
		const paramsObject = {};
		for (let [key, value] of searchParams.entries()) {
			paramsObject[key] = value;
		}
		setQueryParameters(paramsObject);
		setContent(paramsObject.content);
	}, [searchParams]);

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
