import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "../../page_elements/default_style.css";

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
    useEffect(() => {
        fetch(`/api/authors/${authorId || 1}`)
            .then(response => response.json())
            .then(data => setAuthor(data))
    },[authorId])


  return (
    <div className="screen">
      <h1>{author.name} {author.lastName}</h1>
    </div>
  );
};

export default AuthorScreen;

