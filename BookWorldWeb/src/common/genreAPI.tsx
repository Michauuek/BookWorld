import axios from "axios";

export type Genre = {
    id: number;
    name: string;
}

export const GetGenres = () => {
    return axios.get<Genre[]>('/api/genres/')
}