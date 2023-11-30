import axios from "axios";
import { Book } from "../components/pages/book/BookList";
import { BookRequest } from "./adminAPI";

export type RatingRequest = {
  bookId: number
  comment?: string
  rating: number
}

export type BookRatingResponse = {
  id: number
  bookId: number
  userId: string
  comment?: string
  rating: number
}

export const AddRating = (request: RatingRequest) => {
  return axios.post('/api/ratings/create', request)
}

export const GetRating = (bookId: number, userId: string) => {
  const payload = {
    where: {
      AND: [
        {
          bookId: {
            equals: bookId
          }
        },
        {
          userId: {
            equals: userId
          }
        },
      ]
    },
    pagination: {
      take: 1,
      skip: 0
    },
  }
  console.log(`requesting rating for book ${bookId} and user ${userId}`)
  return axios.post(`/api/ratings/elastic/get`, payload)
}

export const getBook = (bookId: string) => {
  return axios.get<Book>(`/api/books/${bookId}`)
}

export const updateBook = (id: string, book: BookRequest) => {
  return axios.put(`/api/books/${id}`, book)
}