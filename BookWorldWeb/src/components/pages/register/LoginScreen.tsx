
import React, { useState } from 'react';
import "../../page_elements/default_style.css";
import { useAuth } from '../../../common/auth';
import { useNavigate } from 'react-router-dom';
import "./login_screen.css";
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify';



const LoginScreen = () => {
    const { login } = useAuth();

    const nav = useNavigate();
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        login(email, password).then(response => {
            toast(`Logged in as ${email}`, { type: 'success' })
            nav('/');
        }
        )
        .catch((error) => {
            console.log(error);
            toast(error.message, { type: 'error' })
        }
        )
        return false;
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    return (
        <div className="screen">
        <form onSubmit={handleSubmit} className={'reg-log-form'}>
            <label>
                Email:
                <input type="text" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
                Password:
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit">Login</button>
        </form>
        </div>

    );
};

export default LoginScreen;
