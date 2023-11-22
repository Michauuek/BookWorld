import axios from "axios";

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