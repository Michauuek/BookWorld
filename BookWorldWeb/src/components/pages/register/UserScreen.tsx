import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/auth";
import { User } from "../../../common/adminAPI";
import axios from "axios";


const UnselLabel = (props: {label: string, value: ReactNode}) => {
    return <p className="unsel">{props.label}: <span>{props.value}</span></p>
}


export const UserScreen = () => {
    const { user } = useAuth();

    const [allUser, setUser] = useState<User|null>(null)

    useEffect(() => {
        axios.get<User>(`/api/users/${user.userId}`)
        .then(response => response.data)
        .then(data => setUser(data));
    }, [user.userId])   

    return <>
        <div className="screen">
            <h1>User</h1>
            <UnselLabel label="Email" value={allUser?.email} />
            <UnselLabel label="Name" value={allUser?.name} />
            <UnselLabel label="Last name" value={allUser?.lastName} />
            <UnselLabel label="Role" value={allUser?.role} />
            <UnselLabel label="Created at" value={allUser?.createdAt?.toString()} />


            <h1>Reset password</h1>
            <form>
                <label>
                    New password: 
                    <input type="password" placeholder="new password" />
                </label><br/>
                <label>
                    Confirm new password:
                    <input type="password" placeholder="confirm new password" />
                </label><br/>
                <button type="submit">Reset password</button>
            </form>
            <h1>Delete account</h1>
            <button type="submit">Delete account</button>
        </div>
    </>   
}