import {Book} from "../pages/book/BookList.tsx";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {toast} from "react-toastify";
import {useAuth} from "../../common/auth.tsx";
import "./default_style.css";

export default function BookThumbnail(props: {book: Book}) {
    const { user } = useAuth();
    const book = props.book
    const navigate = useNavigate();

    const deleteBook = (id: number) => {
        axios.delete("/api/books/" + id).then(() => {
            toast.success("Book deleted successfully")
            navigate("/")
        }).catch(error => {
            console.error(error)
            toast.error("Error deleting book")
        })
    }

    return (
        <div className="book-thumbnail">
            <img src={book.coverUrl} alt={book.title} />
            <h3>{book.title}</h3>
            {
                user.role === "ADMIN" &&
                <div className="admin-buttons">
                    <Link className={"edit-book"} to={"/admin/book/" + book.id}>Edit</Link>
                    <button className={"delete-book"} onClick={() => deleteBook(book.id)}>Delete</button>
                </div>
            }
        </div>
    )
}