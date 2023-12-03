
import { useNavigate } from 'react-router-dom';
import './admin.css';
import {useAuth} from "../../../../common/auth.tsx";


const AdminScreen = () => {
    const navigate = useNavigate();
    const role = useAuth().user.role;

    const handleUserManagement = () => {
        navigate('/admin/users');
    };

    const handleAddAuthor = () => {
        navigate('/admin/add-author');
    }

    return (
        <div className="admin-container">
            {role === 'ADMIN' ? (
                <div>
                    <h1 className="admin-title">Admin Screen</h1>
                    <div className="admin-button-container">
                        <button className="admin-button" onClick={handleUserManagement}>
                            User Management
                        </button>
                        <button className="admin-button" onClick={() => navigate("/admin/add-book")}>
                            Add Books
                        </button>
                        <button className="admin-button" onClick={handleAddAuthor}>
                            Add Author
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className="admin-title">You are not an admin</h1>
                </div>
            )}
        </div>
    );
};

export default AdminScreen;
