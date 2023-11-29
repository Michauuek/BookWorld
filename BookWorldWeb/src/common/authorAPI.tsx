import axios from "axios";



export const AddRating = (request: RatingRequest) => {
    return axios.post('/api/ratings/create', request)
}