import { Button, Modal, TextField } from "@mui/material";
import { User, changeUserData, getUserStatus, resetPassword, setUserStatus } from "../../../../common/adminAPI";
import "../../../../index.css";
import { useEffect, useState } from "react";


interface Props {
    user: User;
    handleClose: () => void;
    show: boolean;
    refreshUsers: () => void;
}


export const EditUserModal = ({ user, show, handleClose, refreshUsers }: Props) => {
    const [userState, setUserState] = useState<boolean | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [changePasswordMessge, setChangePasswordMessage] = useState<string>("Change password");

    useEffect(() => {
        setIsLoading(true);
        getUserStatus(user.id).then((res) => {
            setUserState(res.data);
        }
        ).finally(() => {
            setIsLoading(false);
        });
    }, [show]);

    const handleCloseModal = () => {
        handleClose();
    }

    const handleBlockUser = () => {
        setIsLoading(true);
        setUserStatus(user.id, !userState).then(() => {
            setUserState(!userState);
            refreshUsers();
        }
        ).finally(() => {
            setIsLoading(false);
        })
    }

    const handleChangePassword = () => {
        setIsLoading(true);
        setChangePasswordMessage("Sending request...");
        resetPassword(user.id).then(() => {
            setChangePasswordMessage("Done.");
            refreshUsers();
        }).catch(() => {
            setChangePasswordMessage("failed.");
        })
            .finally(() => {
                setTimeout(() => {
                    setChangePasswordMessage("Change password");
                }, 5000);
                setIsLoading(false);
            })
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        const data = new FormData(e.target);
        const name = data.get("name") as string;
        const lastName = data.get("lastName") as string;
        const email = data.get("email") as string;
        
        if(
            name === user.name &&
            lastName === user.lastName &&
            email === user.email
        ) {
            return;
        }
        
        setIsLoading(true);
        changeUserData(user.id, email, name, lastName).finally(() => {
            setIsLoading(false);
            refreshUsers();
        }
        );
    }

    const message = userState === undefined ? "Loading..." : userState ? "Block user" : "Unblock user";

    return (
        <>
            <Modal
                open={show}
                onClose={handleCloseModal}
            >
                <div className="content">
                    <div className="modal-header">
                        <h2>Editing {user.name} {user.lastName}</h2>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            name="name"
                            type="text"
                            placeholder="Name"
                            defaultValue={user.name}
                        />
                        <TextField
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            defaultValue={user.lastName}
                        />
                        <TextField
                            name="email"
                            type="text"
                            placeholder="Email"
                            defaultValue={user.email}
                        />
                        <Button type="submit" variant="contained" disabled={isLoading}>
                            Save
                        </Button>
                    </form>
                    <Button type="submit" variant="contained" onClick={handleChangePassword} disabled={isLoading}>
                        {changePasswordMessge}
                    </Button>

                    <Button type="submit" variant="contained" onClick={handleBlockUser} disabled={isLoading}>
                        {message}
                    </Button>
                </div>
            </Modal>
        </>
    )
}


