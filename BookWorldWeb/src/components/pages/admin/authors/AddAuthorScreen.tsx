import React, {useState} from 'react';
import {AddAuthor} from "../../../../common/adminAPI.tsx";
import {toast} from "react-toastify";
import {Author} from "../../../../common/adminAPI.tsx";
import './author.css';
import {useAuth} from "../../../../common/auth.tsx";
import {useNavigate} from "react-router-dom";

export const AddAuthorScreen = () => {
    const role = useAuth().user.role;
    const [newAuthor, setNewAuthor] = useState<Author>({
        authorId: 0,
        name: '',
        lastName: '',
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAuthor({
            ...newAuthor,
            [name]: value,
        });
    };
    const navigate = useNavigate();
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('New Author:', newAuthor);
        newAuthor.authorId = Number(newAuthor.authorId);
        AddAuthor(newAuthor).then(response => {
                toast(`Added author ${newAuthor.name}`, { type: 'success' })
                console.log('Response:', response);
                navigate('/author/' + response.data.id);
            }
        ).catch(error => {
                toast(error.message, { type: 'error' })
                console.error('Error:', error);
            }
        );
    };

    return (
        <div className={'add-author'}>
            {role === 'ADMIN' ? (
                <div>
                    <h2>Add new author</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newAuthor.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={newAuthor.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit">Add Author</button>
                    </form>
                </div>

         ) : (
            <div>
                <h1 className="admin-title">You are not an admin</h1>
            </div>
        )}
        </div>
    );
}