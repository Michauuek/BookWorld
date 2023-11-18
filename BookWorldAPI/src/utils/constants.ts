import {UserRole} from "../model/userRole";
import {BookService} from "../service/bookService";

// todo to envs? 
export const DEFAULT_USER_ROLE: UserRole = "USER";
export const SALT_ROUNDS = 10;
// 15 minutes
export const TOKEN_EXP_TIME = 1000*10 //1000 * 60 * 15;
// 7 days
export const REFRESH_TOKEN_EXP_TIME = 1000 * 60 * 60 * 24 * 7;
export const RANDOM_TIME = 100;


export const createBookService = (): BookService => {
    return new BookService();
};