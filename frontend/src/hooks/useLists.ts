import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { List, Board } from "@/schemas/index";

export const useLists = (boardId: string) => {
  return useQuery<List[]>({
    queryKey: ["lists", boardId],
    queryFn: async () => {
      const { data } = await api.get(`/lists/board/${boardId}`);
      return data;
    },
  });
};

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation<
    List,
    Error,
    Omit<List, "id" | "createdAt" | "updatedAt" | "board" | "tasks">
  >({
    mutationFn: async (newList) => {
      const { data } = await api.post<List>("/lists", newList);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lists", data.boardId] });
    },
  });
};

export const useUpdateList = () => {
  const queryClient = useQueryClient();
  return useMutation<List, Error, Partial<List> & { id: string }>({
    mutationFn: async ({ id, ...updateData }) => {
      const { data } = await api.put<List>(`/lists/${id}`, updateData);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lists", data.boardId] });
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { listId: string; boardId: string }>({
    mutationFn: async ({ listId }) => {
      await api.delete(`/lists/${listId}`);
    },
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
};
