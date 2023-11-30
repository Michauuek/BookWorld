import { useEffect, useRef, useState } from "react";
import { GetUsers, User } from "../../../../common/adminAPI";
import { UserCard } from "./UserCard";
import "./users.css";



// Define the UsersList functional component
export const UsersScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const pageRef = useRef<number>(1);
    const [searchEmail, setSearchEmail] = useState<string>('');
    const pageSize = 10;

    useEffect(() => {
        const loadBooks = async () => {
            if (!hasMore || loading) return;

            setLoading(true);

            GetUsers(pageSize, (pageRef.current - 1) * pageSize, searchEmail)
                .then(response => {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        setUsers(prevUsers => [...prevUsers, ...response.data]);
                        pageRef.current++;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadBooks();
            }
        }, { threshold: 0.5 });

        observer.observe(document.querySelector('.end-marker')!);

        return () => {
            observer.disconnect();
        };
    }, [hasMore, loading, searchEmail]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchEmail(e.target.value);
        setUsers([]);
        pageRef.current = 1;
        setHasMore(true);
    };

    return (
        <div className="users-screen">
            <input
                type="text"
                placeholder="Search by email"
                value={searchEmail}
                onChange={handleSearchChange}
            />
            {users.map((user) => (
                <UserCard user={user} />
            ))}
            {loading && <p>Loading...</p>}
            <div className="end-marker"></div>
        </div>
    );
};

