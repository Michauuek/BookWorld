import axios from "axios";


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