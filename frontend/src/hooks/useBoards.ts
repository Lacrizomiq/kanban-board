import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { Board } from "../schemas";

export const useBoards = () => {
  return useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: async () => {
      const { data } = await api.get("/boards");
      return data;
    },
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBoard: { name: string }) => {
      const { data } = await api.post("/boards", newBoard);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.setQueryData<Board[]>(["boards"], (oldData) =>
        oldData ? [...oldData, data] : [data]
      );
    },
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data } = await api.put(`/boards/${id}`, { name });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.invalidateQueries({ queryKey: ["boards", data.id] });
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (boardId: string) => {
      await api.delete(`/boards/${boardId}`);
      return boardId;
    },
    onSuccess: (boardId) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.setQueryData<Board[]>(["boards"], (oldData) =>
        oldData ? oldData.filter((board) => board.id !== boardId) : []
      );
    },
  });
};

export const useBoardById = (boardId: string) => {
  return useQuery<Board>({
    queryKey: ["boards", boardId],
    queryFn: async () => {
      const { data } = await api.get(`/boards/${boardId}`);
      return data;
    },
    enabled: !!boardId, // Si le boardId n'est pas défini, ne pas exécuter la requête
  });
};
