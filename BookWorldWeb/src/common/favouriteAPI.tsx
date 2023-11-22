import axios from "axios";


type LikeBookRequest = {
    bookId: number,
    like: boolean,
}

type LikeGenreRequest = {
    genreId: number,
    like: boolean,
}

type LikeAuthorRequest = {
    authorId: number,
    like: boolean,
}



export const LikeBook = (bookId: number, like: boolean) => {
    const re: LikeBookRequest = {
        bookId: bookId,
        like: like,
    }
    return axios.post('/api/favourites/book', re)
}

export const LikeGenre = (genreId: number, like: boolean) => {
    const re: LikeGenreRequest = {
        genreId: genreId,
        like: like,
    }
    return axios.post('/api/favourites/genre', re)
}

export const LikeAuthor = (authorId: number, like: boolean) => {
    const re: LikeAuthorRequest = {
        authorId: authorId,
        like: like,
    }
    return axios.post('/api/favourites/author', re)
}