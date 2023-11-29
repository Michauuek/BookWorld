import axios from "axios";

export type Author = {
    id: number;
    name: string;
    lastName: string | null;
}

export const AddRating = (request: RatingRequest) => {
    return axios.post('/api/ratings/create', request)
}


export const GetAuthors = () => {
    return axios.get<Author[]>('/api/authors/')
}
