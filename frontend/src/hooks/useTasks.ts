import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Task } from "@/schemas/index";

export const useTasks = (listId: string) => {
  return useQuery<Task[]>({
    queryKey: ["tasks", listId],
    queryFn: async () => {
      const { data } = await api.get(`/tasks/list/${listId}`);
      return data.sort((a: Task, b: Task) => a.order - b.order);
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Task,
    Error,
    Pick<Task, "title" | "description" | "listId" | "order" | "completed"> &
      Partial<
        Omit<
          Task,
          "id" | "createdAt" | "updatedAt" | "list" | "tag" | "assignee"
        >
      >
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
  return useMutation<Task, Error, Partial<Task>>({
    mutationFn: async (updateData) => {
      const { data } = await api.put<Task>(
        `/tasks/${updateData.id}`,
        updateData
      );
      return data;
    },
    onSuccess: (updatedTask, variables) => {
      // Mettre à jour la tâche dans le cache
      queryClient.setQueryData<Task[]>(
        ["tasks", updatedTask.listId],
        (oldTasks) => {
          return oldTasks
            ? oldTasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
              )
            : oldTasks;
        }
      );

      // Si la tâche a changé de liste, mettre à jour les deux listes
      if (variables.listId && variables.listId !== updatedTask.listId) {
        // Supprimer la tâche de l'ancienne liste
        queryClient.setQueryData<Task[]>(
          ["tasks", variables.listId],
          (oldTasks) => {
            return oldTasks
              ? oldTasks.filter((task) => task.id !== updatedTask.id)
              : oldTasks;
          }
        );

        // Ajouter la tâche à la nouvelle liste
        queryClient.setQueryData<Task[]>(
          ["tasks", updatedTask.listId],
          (oldTasks) => {
            return oldTasks ? [...oldTasks, updatedTask] : [updatedTask];
          }
        );
      }

      // Invalider les requêtes pour s'assurer que les données sont à jour
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
