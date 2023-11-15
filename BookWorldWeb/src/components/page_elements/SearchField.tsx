import { useState } from "react";
import "./search_field.css";

interface SearchResult {
  id: number;
  name: string;
  // add any other properties you expect to receive from the server
}

export const SearchField = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearchTermChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    // send request to server with current search term
    const response = await fetch(`/api/search?q=${newSearchTerm}`);
    const results = await response.json();

    // update search results with response from server
    setSearchResults(results);
  };

  return (
    <div className="search-field">
      <input type="text" value={searchTerm} onChange={handleSearchTermChange} />
      <ul>
        {searchResults.map((result) => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
}
