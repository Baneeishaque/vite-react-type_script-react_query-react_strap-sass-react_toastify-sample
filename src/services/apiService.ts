import type { User } from "../types/User";

export const apiService = {
  getUsers: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const stored = localStorage.getItem("users");
    return stored
      ? (JSON.parse(stored) as User[])
      : [
          { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "User",
          },
        ];
  },

  createUser: async (user: Omit<User, "id">): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = await apiService.getUsers();
    const newUser: User = {
      ...user,
      id: (users.length ? Math.max(...users.map((u) => u.id)) : 0) + 1,
    };
    const updated = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updated));
    return newUser;
  },

  updateUser: async (user: User): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = await apiService.getUsers();
    const updated = users.map((u) => (u.id === user.id ? user : u));
    localStorage.setItem("users", JSON.stringify(updated));
    return user;
  },

  deleteUser: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const users = await apiService.getUsers();
    const updated = users.filter((u) => u.id !== id);
    localStorage.setItem("users", JSON.stringify(updated));
  },
};
