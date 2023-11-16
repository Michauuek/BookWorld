import { useState } from "react";
import "./search_field.css";
import { Book } from "../../pages/book/BookList";
import { Link, useNavigate } from "react-router-dom";
import SearchEntry from "./SearchEntry";

type SearchResult = Book;

export const SearchField = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const navigator = useNavigate();

  const handleSearchTermChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.length < 3) {
      setSearchResults([]);
      return;
    }
    // Construct the payload
    const payload = {
      where: {
        AND: [
          {
            title: {
              contains: newSearchTerm
            }
          }
        ]
      },
      orderBy: {
        id: "desc"
      },
      pagination: {
        take: 5,
        skip: 0
      }
    };

    // send request to server with current search term
    // Make a POST request to the desired endpoint
    const response = await fetch('http://localhost:8000/api/books/elastic/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const results = await response.json();
      setSearchResults(results);
    } else {
      // Handle the error if the response is not okay
      console.error('Failed to fetch data');
    }
  };

  const handleEntryClick = (resultId: number) => {
    // Navigate to the details page
    navigator(`book/${resultId}`);

    // Clear the search field after clicking an entry
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="search-field">
      <input type="text" value={searchTerm} onChange={handleSearchTermChange}/>
      <ul>
        {searchResults.map((result) => (
          <li key={result.id}>
            <div onClick={() => handleEntryClick(result.id)}>
              <SearchEntry thumbnail={result.coverUrl} name={result.title} underString={result.author.name + " " + result.author.lastName}/>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
