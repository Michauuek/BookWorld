
import React, { useState } from 'react';
import "../../page_elements/default_style.css";
import { useAuth } from '../../../common/auth';
import axios from 'axios';
import "./login_screen.css";

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
    const { login } = useAuth();

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
        <form onSubmit={handleSubmit} className={'reg-log-form'}>
            <label>
                Email:
                <input type="text" value={email} placeholder="email@example.com" onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Password:
                <input type="password" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
                Name:
                <input type="text" value={name} placeholder="name" onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Last name:
                <input type="text" value={lastName} placeholder="last name" onChange={(e) => setLastName(e.target.value)} />
            </label>
            <button type="submit">Register</button>
        </form>
        <button
            onClick={() => {
                login('zlot@gmail.com', 'Abc12345')
            }}
        >test
        </button>
        </div>

    );
};

export default RegisterScreen;
