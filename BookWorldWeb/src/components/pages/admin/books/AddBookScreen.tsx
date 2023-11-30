
import { useNavigate } from 'react-router-dom';
import './add_book.css';
import { AddBook } from '../../../../common/adminAPI';
import { toast } from 'react-toastify';
import { BookForm } from './bookForm';

interface BookRequest {
  title: string;
  description?: string;
  isbn?: string;
  authorId: number;
  coverUrl?: string;
  genresIds: number[];
}

export const AddBookScreen = () => {
  const navigate = useNavigate();

  const handleFormSubmit = (newBook: BookRequest) => {

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
      <BookForm onSubmit={handleFormSubmit}
        book={undefined}
      />
    </div>
  );
};


