import axios from "axios";


export type BookRequest = {

  title: string;
  description?: string;
  isbn?: string;
  authorId: number;
  coverUrl?: string;
  genresIds: number[];
}

export type User = {
    id: string;
    email: string;
    name: string | null;
    lastName: string | null;
    role: string;
    createdAt: Date;
    // ratings?: RatingResponse[];
    // favouriteGenres?: FavouriteGenreResponse[];
    // favouriteBooks?: FavouriteBookResponse[];
    // favouriteAuthors?: FavouriteAuthorResponse[];
    
}

export const GetUsers = (take: number, skip: number, email: string = "") => {

const payload = {
    where: {
        AND: [
          {
            email: {
              contains: email
            }
          },
        ]
      },
    pagination: {
      take: take,
      skip: skip
    }
  };

  return axios.post<User[]>('/api/users/elastic/get', payload)
}



export const AddBook = (request: BookRequest) => {
    return axios.post('/api/books/create', request)
}

export type Author = {
    authorId: number;
    name: string;
    lastName: string;
}

export const AddAuthor = (request: Author) => {
    return axios.post('/api/authors/create', request)
}

export const setUserStatus = (id: string, active: boolean) => {
  return axios.patch(`api/users/status/`, {userId: id, active }) 
}

export const getUserStatus = (id: string) => {
  return axios.get<boolean>(`api/users/${id}/status`)
}


export const resetPassword = (id: string) => {
  return axios.patch(`api/users/password/reset`, { userId: id })
}

export const passwordChange = (email: string, oldPassword: string, newPassword: string) => {
  return axios.patch(`api/users/password/change`, { email, oldPassword, newPassword })
}


export const changeUserData = (id: string, email: string, name: string, lastName: string) => {
  return axios.patch(`api/users/data`, { userId: id, email, name, lastName })
}