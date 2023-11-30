
import { useNavigate } from 'react-router-dom';
import './admin.css';



// Define the AdminScreen functional component
const AdminScreen = () => {
    const navigate = useNavigate();

    const handleUserManagement = () => {
        navigate('/admin/users');
    };

    const handleAddAuthor = () => {
        navigate('/admin/add-author');
    }

    return (
        <div className="admin-container">
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
            {/* You can add more components or elements here */}
        </div>
    );
};

export default AdminScreen;
