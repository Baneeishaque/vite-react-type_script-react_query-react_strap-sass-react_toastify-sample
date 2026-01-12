import React, { useState } from "react";
import { Button, FormGroup, Label, Input } from "reactstrap";
import { toast } from "react-toastify";
import type { User } from "../types/User";
interface UserFormProps {
  user?: User;
  onSubmit: (user: Omit<User, "id"> | User) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "User",
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    if (user) {
      onSubmit({ ...formData, id: user.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div>
      <FormGroup>
        <Label for="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="role">Role</Label>
        <Input
          id="role"
          type="select"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option>User</option>
          <option>Admin</option>
          <option>Manager</option>
        </Input>
      </FormGroup>
      <div className="form-actions">
        <Button color="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};
