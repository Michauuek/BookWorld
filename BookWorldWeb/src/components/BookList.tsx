import {useEffect, useState} from "react";
import BookThumbnail from "./BookThumbnail";

export type Book = {
    id: number,
    title: string,
    description: string,
    isbn: string,
    authorId: number,
    coverUrl: string,
}

export default function BookList() {
    const [books, setBooks] = useState<Book[]>([])
    useEffect(() => {
        fetch('/api/books')
            .then(response => response.json())
            .then(data => setBooks(data))
    })

    let bookList = books.map(book => {
        return (
            <BookThumbnail book={book} key={book.id}/>
        )
    })

    return (
        <div className="book-list">
            {bookList}
        </div>
    )
}