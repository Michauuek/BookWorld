import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../../../common/auth";
import { User, passwordChange } from "../../../common/adminAPI";
import axios from "axios";
import { LikedSection } from "./LikedSection";
import { toast } from "react-toastify";


const UnselLabel = (props: {label: string, value: ReactNode}) => {
    return <p className="unsel">{props.label}: <span>{props.value}</span></p>
}


export const UserSettingsScreen = () => {
    const { user } = useAuth();

    const [allUser, setUser] = useState<User|null>(null)

    useEffect(() => {
        axios.get<User>(`/api/users/${user.userId}`)
        .then(response => response.data)
        .then(data => setUser(data));
    }, [user.userId])   


    const handleResetPassword = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = {
            oldpass: event.currentTarget.oldpass.value,
            pass1: event.currentTarget.pass1.value,
            pass2: event.currentTarget.pass2.value,
        }

        if (data.pass1 !== data.pass2) {
            toast(`Passwords don't match`, { type: 'error' })
            return
        }

        if(allUser?.email === undefined) {
            toast(`You must be logged in to change password`, { type: 'error' })
            return
        }
            
        passwordChange(allUser.email, data.oldpass, data.pass2)
        .then(() => {
            toast(`Password changed!`, { type: 'success' })
            window.location.reload()
        })
        .catch((error) => {
            console.log(error);
            toast(error.message, { type: 'error' })
        })
    }

    return <>
        <div className="screen">
            <h1>Reset password</h1>
            <form onSubmit={handleResetPassword}>
                <label>
                    Old password:
                    <input type="password" name='oldpass' placeholder="old password" />
                </label><br/>
                <label>
                    New password: 
                    <input type="password" name='pass1' placeholder="new password" />
                </label><br/>
                <label>
                    Confirm new password:
                    <input type="password" name='pass2' placeholder="confirm new password" />
                </label><br/>
                <button type="submit">Reset password</button>
            </form>
            <h1>Delete account</h1>
            <button type="submit">Delete account</button>
        </div>
    </>   
}