import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { User } from "@/schemas/index";

export const useBoardUsers = (boardId: string) => {
  return useQuery<User[], Error>({
    queryKey: ["boardUsers", boardId],
    queryFn: async () => {
      const { data } = await api.get(`/boards/${boardId}/users`);
      return data;
    },
    enabled: !!boardId,
  });
};
