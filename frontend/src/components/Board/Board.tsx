import React, { useState } from "react";
import {
  useBoards,
  useCreateBoard,
  useUpdateBoard,
  useDeleteBoard,
} from "../../hooks/useBoards";
import { Board } from "../../schemas";

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

  if (isBoardsLoading) return <div>Loading boards...</div>;
  if (boardsError)
    return <div>Error loading boards: {boardsError.message}</div>;

  const handleCreateBoard = () => {
    createBoardMutation.mutate(
      { name: newBoardName },
      {
        onSuccess: () => {
          setNewBoardName("");
        },
      }
    );
  };

  const handleUpdateBoard = () => {
    if (editingBoard) {
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
    deleteBoardMutation.mutate(boardId);
  };

  return (
    <div>
      <h1>Boards</h1>

      {/* Create new board */}
      <div>
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="New board name"
        />
        <button
          onClick={handleCreateBoard}
          disabled={createBoardMutation.isPending}
        >
          {createBoardMutation.isPending ? "Creating..." : "Create Board"}
        </button>
      </div>

      {/* List of boards */}
      <ul>
        {boards?.map((board) => (
          <li key={board.id}>
            {editingBoard?.id === board.id ? (
              <>
                <input
                  type="text"
                  value={editingBoard.name}
                  onChange={(e) =>
                    setEditingBoard({ ...editingBoard, name: e.target.value })
                  }
                />
                <button
                  onClick={handleUpdateBoard}
                  disabled={updateBoardMutation.isPending}
                >
                  {updateBoardMutation.isPending ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditingBoard(null)}>Cancel</button>
              </>
            ) : (
              <>
                {board.name}
                <button onClick={() => setEditingBoard(board)}>Edit</button>
                <button
                  onClick={() => handleDeleteBoard(board.id)}
                  disabled={deleteBoardMutation.isPending}
                >
                  {deleteBoardMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Error messages */}
      {createBoardMutation.isError && (
        <div>Error creating board: {createBoardMutation.error.message}</div>
      )}
      {updateBoardMutation.isError && (
        <div>Error updating board: {updateBoardMutation.error.message}</div>
      )}
      {deleteBoardMutation.isError && (
        <div>Error deleting board: {deleteBoardMutation.error.message}</div>
      )}
    </div>
  );
};

export default BoardComponent;
