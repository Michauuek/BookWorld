import { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import { Book } from '../book/BookList';
import BookThumbnail from '../../page_elements/BookThumbnail';
import './author_screen.css';
import { LikeButton } from '../../page_elements/like_button/LikeButton';
import axios from 'axios';
import { useAuth } from '../../../common/auth';
import { GetAuthorLike, LikeAuthor } from '../../../common/favouriteAPI';
import { AllowLoged } from '../../../common/allowOnly';
import "../../page_elements/default_style.css";


type AuthorScreenProps =
  {
    id: number,
    name: string,
    lastName: string,
  }

const AuthorScreen = () => {
  const { authorId } = useParams();
  const { user } = useAuth();

  const defaultAuthor: AuthorScreenProps = {
    id: 0,
    name: '',
    lastName: '',
  }
  const [author, setAuthor] = useState<AuthorScreenProps>(defaultAuthor)
  const [bestRated, setBestRated] = useState<Book[]>([])
  const [liked, setLiked] = useState<boolean>(false)


  const bestRatedPayload = {
    where: {
      AND: [
        {
          authorId: {
            equals: parseInt(authorId!)
          }
        }
      ]
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
    axios.get<AuthorScreenProps>(`/api/authors/${authorId!}`).then(response => response.data).then(data => setAuthor(data));

    if(user.userId !== null)
    {
    GetAuthorLike(parseInt(authorId!), user.userId!)
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
  }, [authorId])


  return (
    <div className="screen">
      <h1>{author.name} {author.lastName}</h1>
      <div>
      <AllowLoged >
        <LikeButton liked={liked} onClick={(liked) => {
          console.log(`liked ${liked}`);
          LikeAuthor(parseInt(authorId!), liked).then(() => {
            setLiked(liked)})
          }}/>
      </AllowLoged>
      </div>
      <h2 className='title'>Best rated books</h2>
      <div className="book-list">
      {
        bestRated.map((book, index) => (
            <Link to={`/book/${book.id}`} key={index}>
              <BookThumbnail book={book} key={index} />
            </Link>
        ))
      }
      </div>
    </div>
  );
};

export default AuthorScreen;

