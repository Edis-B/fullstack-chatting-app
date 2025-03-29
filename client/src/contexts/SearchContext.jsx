import { createContext, useContext, useEffect } from "react";
import { useSearchParams } from "react-router";
import { contentTypes } from "../common/appConstants";

const SearchContext = createContext();

export function SearchProvider({ children }) {
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const updatedParams = {};

		if (!searchParams.get("content")) {
			updatedParams.content = contentTypes.PEOPLE;
		}

		if (!searchParams.get("page")) {
			updatedParams.page = "1";
		}

		if (!searchParams.get("query")) {
			updatedParams.query = "";
		}

		if (Object.keys(updatedParams).length > 0) {
			setSearchParams((prev) => {
				const newParameters = {
					...Object.fromEntries(prev.entries()),
					...updatedParams,
				};

				return newParameters;
			});
		}
	}, [searchParams, setSearchParams]);

	return (
		<SearchContext.Provider value={{ searchParams, setSearchParams }}>
			{children}
		</SearchContext.Provider>
	);
}

export function useSearch() {
	return useContext(SearchContext);
}
