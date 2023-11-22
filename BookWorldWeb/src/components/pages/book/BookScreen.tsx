import { useContext, useEffect, useState } from 'react';
import { Book } from './BookList';
import { Link, useParams } from 'react-router-dom';
import './book_screen.css';
import "../../page_elements/default_style.css";
import RatingInteractive from './rating/RatingInteractive';
import { Opinions, RatingResponse } from './opinions/Opinions';
import axios from 'axios';
import { AddRating, BookRatingResponse, GetRating, RatingRequest } from '../../../common/booksAPI';
import { AllowLoged } from '../../../common/allowOnly';
import { AuthContext, useAuth } from '../../../common/auth';

// Define the props interface
type BookScreenProps = Book;

// Define the BookScreen functional component
const BookScreen = () => {
  const { bookId } = useParams();
  const { user } = useAuth();

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
    const defaultRating: RatingResponse = {
      id: 0,
      bookId: 0,
      userId: '',
      comment: '',
      rating: 0,
    }
    const [book, setBook] = useState<BookScreenProps>(defaultBook)
    const [rating, setRating] = useState<RatingResponse>(defaultRating)

    useEffect(() => {
       axios.get<BookScreenProps>(`/api/books/${bookId!}`)
          .then(response => response.data)
          .then(data => setBook(data));
          

          GetRating(parseInt(bookId!), user.userId!)
          .then(response => response.data)
          .then(data => {
            if (data.length > 0) {
              setRating(data[0]); // Set the first element of the list as the rating
              // console.log(data[0]);
            }
          });

        console.log(rating);

    },[bookId])

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
          <RatingInteractive key={rating.rating} presetRating={rating.rating} presentComment={rating.comment ?? ""} onClick={(number, comment) => { 
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

