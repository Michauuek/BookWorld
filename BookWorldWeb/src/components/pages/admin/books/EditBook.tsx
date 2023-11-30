import { useNavigate, useParams } from "react-router-dom";
import { BookForm } from "./bookForm"
import { useEffect, useState } from "react";
import { BookRequest } from "../../../../common/adminAPI";
import { getBook, updateBook } from "../../../../common/booksAPI";
import { toast } from "react-toastify";


export const EditBook = () => {
    // get from url id
    const { bookId } = useParams();

    const [book, setBool] = useState<BookRequest>()
    const [isLoading, setIsLoading] = useState(false)

    const nav = useNavigate()

    useEffect(() => {
        setIsLoading(true);
        getBook(bookId!).then(
            (response) => {
                const book = response.data;
                setBool({
                    title: book.title,
                    description: book.description,
                    isbn: book.isbn,
                    authorId: book.author.id,
                    coverUrl: book.coverUrl,
                    genresIds: book.genres.map((x) => x.id)
                });
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [bookId])
    

    function handleFormSubmit(newBook: BookRequest): void {
        newBook.authorId = Number(newBook.authorId);
        updateBook(bookId!, newBook).then(() => {
            toast(`Book modifed.`, { type: 'success' })
            nav(`/book/${bookId}`)
        })
        .catch(() => {
            toast(`Failed .`, { type: 'success' })
        })
    }
    

    const form = isLoading ? <>loading</> : <BookForm onSubmit={handleFormSubmit} book={book as BookRequest} />;

    return (
        <div className='add-book'>
            <h2>Modify Book</h2>
            {form}
        </div>
    )

}