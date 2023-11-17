import React, { FC, useEffect, useState } from 'react';
import { Book } from './BookList';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './book_screen.css';
import "../../page_elements/default_style.css";
import RatingInteractive from './rating/RatingInteractive';

// Define the props interface
type BookScreenProps = Book;

// Define the BookScreen functional component
const BookScreen = () => {
  const { bookId } = useParams();

  const defaultBook: BookScreenProps = {
    id: 0,
    title: '',
    description: '',
    isbn: '',
    genres: [],
    author: { id: 0, name: '', lastName: '' },
    coverUrl: '',
    rating: { value: 0, count: 0 },
  }
  const [book, setBook] = useState<BookScreenProps>(defaultBook)
  useEffect(() => {
    fetch(`/api/books/${bookId || 1}`)
      .then(response => response.json())
      .then(data => setBook(data))
  }, [bookId])

  return (
    <div className="screen">
      <h1>{book.title}</h1>
      <div className="book-details">
        <img src={book.coverUrl} alt={`${book.title} cover`} className="book-cover" />
        <div className="book-info">
          <p className="book-description">{book.description}</p>

          <div className='book-meta'>
            <p>
              Author:{' '}
              <Link to={`/author/${book.author.id}`}>
                {`${book.author.name} ${book.author.lastName}`}
              </Link>
            </p>
            <p>ISBN: {book.isbn}</p>
            <p>
              Genres:{' '}
              {book.genres.map((genre) => (
                <Link key={genre.id} to={`/genre/${genre.id}`}>
                  {genre.name},{' '}
                </Link>
              ))}
            </p>
          </div>
        </div>
        <div className='book-rating-section'>
          {book.rating.count} ratings<br></br>
          <div className='book-rating-container'>
            <div className='book-star'>{'\u2605'}</div>
            <div className="book-rating">{book.rating.value.toFixed(2)}/5</div>
          </div>
          <br></br>Rate book:
          <RatingInteractive presetRating={0} onClick={(number) => console.log(`ocenka ${number}`)} />
        </div>
      </div>
    </div>
  );
};

export default BookScreen;

