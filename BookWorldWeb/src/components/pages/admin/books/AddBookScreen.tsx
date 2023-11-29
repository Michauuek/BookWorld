
import { useLocation, useNavigate } from 'react-router-dom';
import { Author, GetAuthors } from '../../../../common/authorAPI';
import './add_book.css';
import React, { useState, useEffect } from 'react';
import { Genre, GetGenres } from '../../../../common/genreAPI';
import { AddBook } from '../../../../common/adminAPI';
import { toast } from 'react-toastify';

interface BookRequest {
  title: string;
  description?: string;
  isbn?: string;
  authorId: number;
  coverUrl?: string;
  genresIds: number[];
}

export const AddBookScreen = () => {
  const [newBook, setNewBook] = useState<BookRequest>({
    title: '',
    description: '',
    isbn: '',
    authorId: 0,
    coverUrl: '',
    genresIds: [],
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {

    GetAuthors().then(response => {
      setAuthors(response.data);
    }
    ).catch(error => {
      console.error('Error:', error);
    }
    );

    GetGenres().then(response => {
      setGenres(response.data);
    }
    ).catch(error => {
      console.error('Error:', error);
    }
    );

    // fetchAuthors();
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'genresIds') {
      const selectedGenres = Array.from(e.target.selectedOptions, (option) => Number(option.value));
      setNewBook({
        ...newBook,
        [name]: selectedGenres,
      });
    } else {
      setNewBook({
        ...newBook,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('New Book:', newBook);
    newBook.authorId = Number(newBook.authorId);
    AddBook(newBook).then(response => {
      toast(`Added book ${newBook.title}`, { type: 'success' })
      console.log('Response:', response);
      navigate('/book/' + response.data.id);
    }
    ).catch(error => {
      toast(error.message, { type: 'error' })
      console.error('Error:', error);
    }
    );
  };

  return (
    <div className='add-book'>
      <h2>Add a New Book</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newBook.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={newBook.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="isbn">ISBN:</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={newBook.isbn}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="authorId">Author:</label>
          <select
            id="authorId"
            name="authorId"
            value={newBook.authorId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select an author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name} {author.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="coverUrl">Cover URL:</label>
          <input
            type="text"
            id="coverUrl"
            name="coverUrl"
            value={newBook.coverUrl}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="genresIds">Genres:</label>
          <select
  id="genresIds"
  name="genresIds"
  multiple
  value={newBook.genresIds.map(String)}
  onChange={handleInputChange}
  required
  className='genres-select'
>
  {genres.map((genre) => (
    <option key={genre.id} value={String(genre.id)}>
      {genre.name}
    </option>
  ))}
</select>

        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};


