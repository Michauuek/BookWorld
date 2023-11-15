
import React, { useState } from 'react';
import "../../page_elements/default_style.css";

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
        fetch('/api/users/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })  .then((response) => response.json() as Promise<UserResponse>)
        .then((responseData) => {
          // Handle the response data here
          console.log('Response:', responseData);
  
          // Now you can use responseData as a UserResponse type
          // For example, you might want to update state or navigate to another page
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch
          console.error('Error:', error);
        });
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
        </div>
    );
};

export default RegisterScreen;
