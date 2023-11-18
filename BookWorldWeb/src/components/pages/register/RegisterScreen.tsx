
import React, { useState } from 'react';
import "../../page_elements/default_style.css";
import { get_token } from '../../auth';
import axios from 'axios';

type RegisterRequest = {
    email: string,
    password: string,
    name: string,
    lastName: string,
}

type UserResponse = {
    id: string;
    email: string;
    name: string;
    lastName: string;
    role: string;
    createdAt: string;
  }

const RegisterScreen = () => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: RegisterRequest = {
            email,
            password,
            name,
            lastName,
        };

        axios.post<UserResponse>('/api/users/create', data)
        .then(response => response.data)
        .then(data => console.log(data))
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');



    return (
        <div className="screen">
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Last name:
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </label>
            <button type="submit">Register</button>
        </form>
        <button
            onClick={() => {
                get_token('zlot@gmail.com', 'Abc12345')
            }}
        >test
        </button>
        </div>

    );
};

export default RegisterScreen;
