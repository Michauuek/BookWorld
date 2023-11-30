import { useEffect, useState } from "react"
import { BookRequest } from "../../../../common/adminAPI"
import { Author, GetAuthors } from "../../../../common/authorAPI"
import { Genre, GetGenres } from "../../../../common/genreAPI"




interface BookFormProps {
    book: BookRequest|undefined
    onSubmit: (newBook: BookRequest) => void
}

export const BookForm = (props: BookFormProps) => {
    let book;

    if (props.book === undefined) {
        book = {
            title: '',
            description: '',
            isbn: undefined,
            authorId: 0,
            coverUrl: undefined,
            genresIds: [],
        }
    } else {
        book = props.book
    }

    const [newBook, setNewBook] = useState<BookRequest>({
        title: book.title,
        description: book.title,
        isbn: book.isbn,
        authorId: book.authorId,
        coverUrl: book.coverUrl,
        genresIds: book.genresIds,
    });

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
    }, [location]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'genresIds') {
            // @ts-ignore
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

    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        props.onSubmit(newBook)
    }

    return (
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
    )
}