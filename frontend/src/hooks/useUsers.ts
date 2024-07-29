import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { User, UserBoards } from "@/schemas";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { user: User; token: string },
    Error,
    { email: string; password: string; name?: string }
  >({
    mutationFn: async (userData) => {
      const { data } = await api.post<{ user: User; token: string }>(
        "/users/register",
        userData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, Partial<User>>({
    mutationFn: async (updateData) => {
      const { data } = await api.put<User>("/users/me", updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useInviteUser = () => {
  return useMutation<{ message: string; role: string }, Error, string>({
    mutationFn: async (inviteData) => {
      const { data } = await api.post<{ message: string; role: string }>(
        "/users/invite",
        inviteData
      );
      return data;
    },
  });
};

export const useUpdateBoardAccess = () => {
  return useMutation<
    { message: string; updatedAccess: UserBoards },
    Error,
    string
  >({
    mutationFn: async (boardId) => {
      const { data } = await api.post<{
        message: string;
        updatedAccess: UserBoards;
      }>("/users/me/boards", boardId);
      return data;
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
