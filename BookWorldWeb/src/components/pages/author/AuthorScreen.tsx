import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../../page_elements/default_style.css";
import { Book } from '../book/BookList';
import BookThumbnail from '../../page_elements/BookThumbnail';
import './author_screen.css';

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

  const defaultAuthor: AuthorScreenProps = {
    id: 0,
    name: '',
    lastName: '',
  }
  const [author, setAuthor] = useState<AuthorScreenProps>(defaultAuthor)
  const [bestRated, setBestRated] = useState<Book[]>([])

  useEffect(() => {
    fetch(`/api/authors/${authorId!}`)
      .then(response => response.json())
      .then(data => setAuthor(data))
  }, [authorId])

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
      take: 10,
      skip: 0
    },
  }

  useEffect(() => {
    fetch(`/api/books/elastic/get/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bestRatedPayload)
    })
      .then(response => response.json())
      .then(data => setBestRated(data))
  }, [authorId])


  return (
    <div className="screen">
      <h1>{author.name} {author.lastName}</h1>
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

