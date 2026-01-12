import React, { useState, useEffect } from "react";
import { Container, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserForm } from "./components/UserForm";
import { UserTable } from "./components/UserTable";
import { apiService } from "./services/apiService";
import type { User } from "./types/User";
import "./styles/App.scss";

const CrudApp: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: apiService.getUsers,
  });

  const createMutation = useMutation({
    mutationFn: apiService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setModalOpen(false);
      toast.success("User created successfully!");
    },
    onError: () => {
      toast.error("Failed to create user. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: apiService.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setModalOpen(false);
      setEditingUser(undefined);
      toast.success("User updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update user. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete user. Please try again.");
    },
  });

  const handleCreate = () => {
    setEditingUser(undefined);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSubmit = (userData: Omit<User, "id"> | User) => {
    if ("id" in userData) {
      updateMutation.mutate(userData);
    } else {
      createMutation.mutate(userData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingUser(undefined);
  };

  useEffect(() => {
    if (error) {
      toast.error("Failed to load users. Please refresh the page.");
    }
  }, [error]);

  return (
    <Container className="crud-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="header">
        <h1>User Management</h1>
        <Button color="success" onClick={handleCreate}>
          + Add User
        </Button>
      </div>

      {isLoading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <Modal isOpen={modalOpen} toggle={handleCancel}>
        <ModalHeader toggle={handleCancel}>
          {editingUser ? "Edit User" : "Add New User"}
        </ModalHeader>
        <ModalBody>
          <UserForm
            user={editingUser}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </ModalBody>
      </Modal>
    </Container>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CrudApp />
    </QueryClientProvider>
  );
}

export default App;
