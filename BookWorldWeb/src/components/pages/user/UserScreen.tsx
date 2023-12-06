import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "../../../common/auth";
import { User} from "../../../common/adminAPI";
import axios from "axios";
import { LikedSection } from "./LikedSection";
import { Link } from "react-router-dom";
import "./user.css";

const UnselLabel = (props: { label: string, value: ReactNode }) => {
  return (
    <p className="unsel">
      <span className="label">{props.label}:</span>{" "}
      <span className="value">{props.value}</span>
    </p>
  );
};

export const UserScreen = () => {
  const { user } = useAuth();

  const [allUser, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (user.userId === null) return;
    axios.get<User>(`/api/users/${user.userId}`)
      .then(response => response.data)
      .then(data => setUser(data));
  }, [user.userId]);

  return (
    <div className="user-screen">
      <h1>User</h1>
      <div className="user-details">
        <UnselLabel label="Email" value={allUser?.email} />
        <UnselLabel label="Name" value={allUser?.name} />
        <UnselLabel label="Last name" value={allUser?.lastName} />
        <UnselLabel label="Role" value={allUser?.role} />
        <UnselLabel
          label="Created at"
          value={allUser?.createdAt?.toString()}
        />
      </div>
      <LikedSection user={user.userId!} />

        <br/>
        <br/>
      <Link to="/user/settings">
        <button className="user-settings-button">User Settings</button>
      </Link>
    </div>
  );
};
