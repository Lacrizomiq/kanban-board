"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useBoardById } from "@/hooks/useBoards";
import ListComponent from "@/components/List/List";

const BoardPage: React.FC = () => {
  const params = useParams();
  const boardId = params.id as string;
  const { data: board, isLoading, error } = useBoardById(boardId);

  if (isLoading)
    return <div className="text-center py-8">Loading board...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error loading board: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{board?.name}</h1>
      <ListComponent boardId={boardId} />
    </div>
  );
};

export default BoardPage;
