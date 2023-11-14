import {useEffect, useState} from "react";
import BookThumbnail from "../../page_elements/BookThumbnail";
import { Link } from "react-router-dom";

export type Author = {
    id: number,
    name: string,
    lastName: string,
}

export type Genre = {
    id: number,
    name: string,
}

export type Rating = {
    value: number,
    count: number,
}

export type Book = {
    id: number,
    title: string,
    description: string,
    isbn: string,
    coverUrl: string,
    author: Author,
    genres: Genre[],
    rating: Rating,
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
            <Link to={`/book/${book.id}`} key={book.id}>
            <BookThumbnail book={book} key={book.id}/>
            </Link>
        )
    })

    return (
        <div className="book-list">
            {bookList}
        </div>
    )
}