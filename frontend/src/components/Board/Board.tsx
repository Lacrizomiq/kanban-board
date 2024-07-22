"use client";

import React, { useState } from "react";
import {
  useBoards,
  useCreateBoard,
  useUpdateBoard,
  useDeleteBoard,
} from "../../hooks/useBoards";
import { Board } from "../../schemas";
import { PlusIcon, PencilIcon, TrashIcon } from "../Icons/Icons";
import Link from "next/link";

const BoardComponent: React.FC = () => {
  const [newBoardName, setNewBoardName] = useState("");
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);

  const {
    data: boards,
    isPending: isBoardsLoading,
    error: boardsError,
  } = useBoards();
  const createBoardMutation = useCreateBoard();
  const updateBoardMutation = useUpdateBoard();
  const deleteBoardMutation = useDeleteBoard();

  if (isBoardsLoading)
    return <div className="text-center py-10">Loading boards...</div>;
  if (boardsError)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading boards: {boardsError.message}
      </div>
    );

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoardMutation.mutate(
        { name: newBoardName },
        {
          onSuccess: () => {
            setNewBoardName("");
          },
        }
      );
    }
  };

  const handleUpdateBoard = () => {
    if (editingBoard && editingBoard.name.trim()) {
      updateBoardMutation.mutate(
        { id: editingBoard.id, name: editingBoard.name },
        {
          onSuccess: () => {
            setEditingBoard(null);
          },
        }
      );
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      deleteBoardMutation.mutate(boardId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Boards</h1>

      {/* Create new board */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Board</h2>
        <div className="flex">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Enter board name"
            className="flex-grow mr-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateBoard}
            disabled={createBoardMutation.isPending || !newBoardName.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {createBoardMutation.isPending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </span>
            ) : (
              <span className="flex items-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Board
              </span>
            )}
          </button>
        </div>
      </div>

      {/* List of boards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Boards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards?.map((board) => (
            <div key={board.id} className="bg-white p-4 rounded-lg shadow">
              {editingBoard?.id === board.id ? (
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={editingBoard.name}
                    onChange={(e) =>
                      setEditingBoard({ ...editingBoard, name: e.target.value })
                    }
                    className="mb-2 px-2 py-1 border rounded"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleUpdateBoard}
                      disabled={updateBoardMutation.isPending}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      {updateBoardMutation.isPending ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingBoard(null)}
                      className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <Link
                    href={`/boards/${board.id}`}
                    className="font-medium hover:text-blue-500 cursor-pointer"
                  >
                    {board.name}
                  </Link>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingBoard(board)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBoard(board.id)}
                      disabled={deleteBoardMutation.isPending}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error messages */}
      {createBoardMutation.isError && (
        <div className="mt-4 text-red-500">
          Error creating board: {createBoardMutation.error.message}
        </div>
      )}
      {updateBoardMutation.isError && (
        <div className="mt-4 text-red-500">
          Error updating board: {updateBoardMutation.error.message}
        </div>
      )}
      {deleteBoardMutation.isError && (
        <div className="mt-4 text-red-500">
          Error deleting board: {deleteBoardMutation.error.message}
        </div>
      )}
    </div>
  );
};

export default BoardComponent;
