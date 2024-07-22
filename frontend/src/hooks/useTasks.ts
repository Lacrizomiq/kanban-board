import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Task } from "@/schemas/index";

export const useTasks = (listId: string) => {
  return useQuery<Task[]>({
    queryKey: ["tasks", listId],
    queryFn: async () => {
      const { data } = await api.get(`/tasks/list/${listId}`);
      return data;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Task,
    Error,
    Omit<Task, "id" | "createdAt" | "updatedAt" | "list" | "tag" | "assignee">
  >({
    mutationFn: async (newTask) => {
      const { data } = await api.post<Task>("/tasks", newTask);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.listId] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, Partial<Task> & { id: string }>({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.put<Task>(`/tasks/${id}`, updateData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.listId] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; listId: string }>({
    mutationFn: async ({ id }) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: (_, { listId }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", listId] });
    },
  });
};

export const useAssignTask = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, { id: string; assigneeId: string }>({
    mutationFn: async ({ id, assigneeId }) => {
      const { data } = await api.post<Task>(`/tasks/${id}/assign`, {
        assigneeId,
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.listId] });
    },
  });
};
