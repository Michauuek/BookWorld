import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../../page_elements/default_style.css";
import { Author, Book } from '../book/BookList';
import BookThumbnail from '../../page_elements/BookThumbnail';
import './author_screen.css';
import { LikeButton } from '../../page_elements/like_button/LikeButton';
import axios from 'axios';
import { useAuth } from '../../../common/auth';
import { GetAuthorLike, LikeAuthor } from '../../../common/favouriteAPI';
import { AllowLoged } from '../../../common/allowOnly';


// Define the props interface
type AuthorScreenProps =
  {
    id: number,
    name: string,
    lastName: string,
  }

// Define the BookScreen functional component
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

  // useEffect(() => {
  //   axios.get<AuthorScreenProps>(`/api/authors/${authorId!}`)
  // }, [authorId])


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
          <BookThumbnail book={book} key={index} />
        ))
      }
      </div>
    </div>
  );
};

export default AuthorScreen;

