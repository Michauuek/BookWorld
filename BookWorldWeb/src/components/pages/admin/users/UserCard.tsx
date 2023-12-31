import { useState } from 'react';
import { User } from '../../../../common/adminAPI';
import { EditUserModal } from './EditUserModal';

interface UserCardProps {
  user: User
  refreshUsers: () => void
}

export const UserCard = (props: UserCardProps) => {
  const [show, setShow] = useState(false);

  return (<>
    {<EditUserModal user={props.user} handleClose={() => setShow(false)} show={show} refreshUsers={props.refreshUsers} />}
    <div className="user-card">
      <div className="user-info-left">
        <h2>{`${props.user.name} ${props.user.lastName}`}</h2>
        <p>Email: {props.user.email}</p>
      </div>
      <div className="user-info-right">
        <p>Role: {props.user.role}</p>
        <p>Created At: {new Date(props.user.createdAt).toDateString()}</p>
      </div>
      <button
        onClick={() => setShow(true)}
      >
        Edit
      </button>
    </div>
  </>
  );
};

