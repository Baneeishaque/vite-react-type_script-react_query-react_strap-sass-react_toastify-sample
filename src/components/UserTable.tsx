import React from "react";
import { Button, Table } from "reactstrap";
import type { User } from "../types/User";
interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <Table striped bordered hover responsive className="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <span className={`badge badge-${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </td>
            <td>
              <Button
                color="info"
                size="sm"
                onClick={() => onEdit(user)}
                className="me-2"
              >
                Edit
              </Button>
              <Button
                color="danger"
                size="sm"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
