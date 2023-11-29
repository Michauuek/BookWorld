import { User } from '../../../../common/adminAPI';

type UserCardProps = {
    user: User;
    };

export const UserCard = (props: UserCardProps) => {
  return (
    <div className="user-card">
      <div className="user-info-left">
        <h2>{`${props.user.name} ${props.user.lastName}`}</h2>
        <p>Email: {props.user.email}</p>
      </div>
      <div className="user-info-right">
        <p>Role: {props.user.role}</p>
        <p>Created At: {new Date(props.user.createdAt).toDateString()}</p>
        {/* Add more information on the right side as needed */}
      </div>
    </div>
  );
};

