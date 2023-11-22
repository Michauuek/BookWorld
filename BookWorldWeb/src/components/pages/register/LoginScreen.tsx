
import React, { useState } from 'react';
import "../../page_elements/default_style.css";
import { useAuth } from '../../../common/auth';
import { useNavigate } from 'react-router-dom';


const LoginScreen = () => {
    const { login } = useAuth();

    const nav = useNavigate();
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        login(email, password)
        .then(() => {
            console.log("logged in");
            nav('/');
        }
        )
        .catch((error) => {
            console.log(error);
        })
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


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
            <button type="submit">Login</button>
        </form>
        
        </div>

    );
};

export default LoginScreen;
