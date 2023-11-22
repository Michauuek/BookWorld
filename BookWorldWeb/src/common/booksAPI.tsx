import axios from "axios";

export type RatingRequest = {
    bookId: number
    comment?: string
    rating: number
}

export const AddRating = (request: RatingRequest) => {
    return axios.post('/api/ratings/create', request)
}