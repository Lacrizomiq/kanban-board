import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Tag } from "@/schemas";

export const useTags = () => {
  return useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await api.get("/tags");
      return data;
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation<Tag, Error, Omit<Tag, "id">>({
    mutationFn: async (newTag) => {
      const { data } = await api.post<Tag>("/tags", newTag);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation<Tag, Error, Tag>({
    mutationFn: async (updatedTag) => {
      const { data } = await api.put<Tag>(`/tags/${updatedTag.id}`, updatedTag);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (tagId) => {
      await api.delete(`/tags/${tagId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
