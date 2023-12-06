import { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import { Book } from '../book/BookList';
import BookThumbnail from '../../page_elements/BookThumbnail';
import './genre_screen.css';
import { LikeButton } from '../../page_elements/like_button/LikeButton';
import axios from 'axios';
import { useAuth } from '../../../common/auth';
import { GetGenreLike, LikeGenre } from '../../../common/favouriteAPI';
import { AllowLoged } from '../../../common/allowOnly';
import "../../page_elements/default_style.css";


// Define the props interface
type GenreScreenProps =
  {
    id: number,
    name: string,
  }

// Define the BookScreen functional component
const GenreScreen = () => {
  const { genreId } = useParams();
  const { user } = useAuth();

  const defaultGenre: GenreScreenProps = {
    id: 0,
    name: '',
  }
  const [genre, setGenre] = useState<GenreScreenProps>(defaultGenre)
  const [bestRated, setBestRated] = useState<Book[]>([])
  const [liked, setLiked] = useState<boolean>(false);
  const bestRatedPayload = {
    where: {
      genres: {
        some: {
          genreId: parseInt(genreId!)
        }
      }
    },
    orderBy: {
      ratingValue: "desc"
    },
    pagination: {
      take: 5,
      skip: 0
    },
  }

  useEffect(() => {
    axios.post<Book[]>('/api/books/elastic/get', bestRatedPayload).then(response => response.data).then(data => setBestRated(data));
    axios.get<GenreScreenProps>(`/api/genres/${genreId!}`).then(response => response.data).then(data => setGenre(data));

    if (user.userId !== null) {
      console.log("user is logged in, requesting likes")
      GetGenreLike(parseInt(genreId!), user.userId!)
        .then(response => response.data)
        .then(data => {
          console.log(data);
          if (data.length > 0) {
            setLiked(true);
            console.log("liked set")
            // Set the first element of the list as the rating
          } else {
            setLiked(false);
            console.log("liked unset")
          }
        });
    }
  }, [genreId])


  return (
    <div className="screen">
      <h1>{genre.name}</h1>
      <div>
        <AllowLoged >
          <LikeButton liked={liked} onClick={(liked) => {
            console.log(`liked ${liked}`);
            LikeGenre(parseInt(genreId!), liked).then(() => {
              setLiked(liked)
            })
          }}
          />
        </AllowLoged>
      </div>
      <h2 className='title'>Best rated books</h2>
      <div className="book-list">
        {
          bestRated.map((book) => (
              <Link to={`/book/${book.id}`} key={book.id}>
                <BookThumbnail book={book} key={book.id} />
              </Link>
          ))
        }
      </div>
    </div>
  );
};

export default GenreScreen;

