import { useEffect, useState } from 'react';
import { Book } from './BookList';
import { Link, useParams } from 'react-router-dom';
import './book_screen.css';
import "../../page_elements/default_style.css";
import RatingInteractive from './rating/RatingInteractive';
import { Opinions } from './opinions/Opinions';
import axios from 'axios';
import { AddRating, RatingRequest } from '../../../common/booksAPI';
import { AllowLoged } from '../../../common/allowOnly';

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
        author: {id:0, name:'', lastName:''},
        coverUrl: '',
        rating: {value:0, count:0},
    }
    const [book, setBook] = useState<BookScreenProps>(defaultBook)
    useEffect(() => {
       axios.get<BookScreenProps>(`/api/books/${bookId!}`)
          .then(response => response.data)
          .then(data => setBook(data))
    },[bookId])
  // Helper function to generate star icons based on the rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const fractionalPart = rating % 1;
    const stars = [];
    console.log(rating);

    for (let i = 1; i < fullStars; i++) {
      stars.push(<span key={i}>&#9733;</span>); // Full star
      console.log(stars);
    }

    if (fractionalPart > 0) {
      const width = `${fractionalPart * 100}%`;
      stars.push(<span key={fullStars} style={{ position: 'relative' }}>&#9733;<span style={{ position: 'absolute', width, overflow: 'hidden' }}>&#9733;</span></span>);
    }

    return stars;
  };

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
          <AllowLoged>
          <br></br>Rate book:
          <RatingInteractive presetRating={0} onClick={(number, comment) => { 
              const request: RatingRequest = {
                bookId: book.id,
                rating: number,
                comment: comment,
              }
              AddRating(request);
              console.log(`ocenka ${number} komentarz "${comment}"`)
            }} />
          </AllowLoged>
        </div>
      </div>
      <div className='book-opinions'>
        <h3>Opinions:</h3>
        <Opinions bookId={book.id} />
      </div>
    </div>
  );
};

export default BookScreen;

