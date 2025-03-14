import { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [query, setQuery] = useState(null);
    const [content, setContent] = useState(null);

    return (
        <SearchContext.Provider value={{ query, setQuery, content, setContent }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    return useContext(SearchContext);
}
