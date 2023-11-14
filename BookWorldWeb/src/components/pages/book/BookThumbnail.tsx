import {Book} from "./BookList.tsx";

export default function BookThumbnail(props: {book: Book}) {
    let book = props.book
    return (
        <div className="book-thumbnail">
            <img src={book.coverUrl} alt={book.title} />
            <h3>{book.title}</h3>
        </div>
    )
}