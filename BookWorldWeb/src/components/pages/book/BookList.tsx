import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BookThumbnail from "../../page_elements/BookThumbnail.tsx";
import "../../page_elements/default_style.css";
import axios from "axios";
import { RangeSearch, Sorting, Sort, TextSearch } from "../../searchComponents/search.tsx";

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
    const location = useLocation();
    const [books, setBooks] = useState<Book[]>([])
    const [filter, setFilter] = useState<Map<string, object>>(new Map());
    const [sortings, setSortings] = useState<Sort[]>([])


    const filters = [
        // title
        <TextSearch placeholder="Search titles..." value={""} onChange={(value) => {
            // set filter title to value {AND: [{title: {equals: value}}]}
            let newFilter = new Map(filter);
            newFilter.set("title", { contains: value });
            setFilter(newFilter);
        }} />,
        <RangeSearch min={0} max={5} valuelow={0} valuehigh={5} onChange={(low, high) => {
            // set filter rating to value {AND: [{rating: {gte: low}}, {rating: {lte: high}}]}
            let newFilter = new Map(filter);
            newFilter.set("ratingValue", { gte: low, lte: high });
            setFilter(newFilter);
        }} />,
    ]

    const sorting = <Sorting avalibleColumns={["title", "ratingValue"]} onChange={(value) => {
        // set sorting to value {title: ASC}
        setSortings(value);
    }} />



    useEffect(() => {
        let filters = Array.from(filter.entries()).map(([key, value]) => {
            return {
                [key]: value
            }
        })

        // transform sortings into orderBy (object with keys as columns and values as order)
        let orderBy = sortings.reduce((acc, sort) => {
            return { ...acc, ...sort }
        }, {})


        let where = {
            AND: [
                ...filters
            ]
        }

        let request = {
            where: where,
            orderBy: orderBy,
        }

        console.log(request)

        //call elastic get
        axios.post<Book[]>(`/api/books/elastic/get`, request)
            .then(response => response.data)
            .then(data => setBooks(data))
            .catch(error => console.log(error))
    }, [location, filter, sortings])

    const bookList = books.map(book => {
        return (
            <Link to={`/book/${book.id}`} key={book.id}>
                <BookThumbnail book={book} key={book.id} />
            </Link>
        )
    })



    return (
        <div className="screen">
            <div className="search">
                {filters}
            </div>
            <div className="sorting">
                {sorting}
            </div>
            <div className="book-list">
                {bookList}
            </div>
        </div>
    )
}