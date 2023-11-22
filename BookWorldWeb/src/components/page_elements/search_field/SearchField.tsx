import { useState } from "react";
import "./search_field.css";
import { Book } from "../../pages/book/BookList";
import { Link, useNavigate } from "react-router-dom";
import SearchEntry from "./SearchEntry";
import axios from "axios";

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

    axios.post<Book[]>('/api/books/elastic/get', payload)
      .then(response => {
        setSearchResults(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
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
