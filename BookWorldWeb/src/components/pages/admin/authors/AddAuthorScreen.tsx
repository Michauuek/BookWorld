import React, {useState} from 'react';
import {AddAuthor} from "../../../../common/adminAPI.tsx";
import {toast} from "react-toastify";
import {Author} from "../../../../common/adminAPI.tsx";
import './author.css';

export const AddAuthorScreen = () => {
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
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('New Author:', newAuthor);
        newAuthor.authorId = Number(newAuthor.authorId);
        AddAuthor(newAuthor).then(response => {
                toast(`Added author ${newAuthor.name}`, { type: 'success' })
                console.log('Response:', response);
            }
        ).catch(error => {
                toast(error.message, { type: 'error' })
                console.error('Error:', error);
            }
        );
    };

    return (
        <div className={'add-author'}>
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
    )
}