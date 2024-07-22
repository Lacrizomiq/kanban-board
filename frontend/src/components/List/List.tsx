import React, { useState } from "react";
import {
  useLists,
  useCreateList,
  useUpdateList,
  useDeleteList,
} from "@/hooks/useLists";
import { List } from "@/schemas";
import { PlusIcon, PencilIcon, TrashIcon } from "@/components/Icons/Icons";

interface ListComponentProps {
  boardId: string;
  initialLists: List[];
}

const ListComponent: React.FC<ListComponentProps> = ({ boardId }) => {
  const [newListName, setNewListName] = useState("");
  const { data: lists, isLoading, error } = useLists(boardId);
  const createListMutation = useCreateList();

  if (isLoading)
    return <div className="text-center py-4">Loading lists...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error loading lists: {error.message}
      </div>
    );

  const handleCreateList = () => {
    if (newListName.trim()) {
      createListMutation.mutate(
        {
          name: newListName,
          boardId,
          order: lists ? lists.length : 0,
        },
        {
          onSuccess: () => setNewListName(""),
        }
      );
    }
  };

  return (
    <div className="flex overflow-x-auto space-x-4 p-4 ">
      {lists &&
        lists.map((list) => (
          <ListItem key={list.id} list={list} boardId={boardId} />
        ))}
      <div className="flex-shrink-0 w-72">
        {!newListName ? (
          <button
            onClick={() => setNewListName(" ")}
            className="w-full p-3 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add another list
          </button>
        ) : (
          <div className="bg-gray-200 p-3 rounded-lg">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter list title..."
              className="w-full p-2 rounded mb-2"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={handleCreateList}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Add List
              </button>
              <button
                onClick={() => setNewListName("")}
                className="text-gray-500 hover:text-gray-700"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ListItem: React.FC<{ list: List; boardId: string }> = ({
  list,
  boardId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(list.name);
  const updateListMutation = useUpdateList();
  const deleteListMutation = useDeleteList();

  const handleUpdateList = () => {
    if (editedName.trim() && editedName !== list.name) {
      updateListMutation.mutate(
        {
          id: list.id,
          name: editedName,
        },
        {
          onSuccess: () => setIsEditing(false),
        }
      );
    } else {
      setIsEditing(false);
    }
  };

  const handleDeleteList = () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      deleteListMutation.mutate({ listId: list.id, boardId });
    }
  };

  return (
    <div
      className="flex-shrink-0 w-72 min-h-96 bg-gray-100 rounded-lg shadow"
      style={{ minHeight: "24rem" }}
    >
      <div className="p-3 flex justify-between items-center bg-gray-200 rounded-t-lg">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleUpdateList}
            className="bg-white px-2 py-1 rounded w-full"
            autoFocus
          />
        ) : (
          <h3 className="font-semibold text-gray-700">{list.name}</h3>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-gray-600 hover:text-blue-500"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDeleteList}
            className="text-gray-600 hover:text-red-500"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-3 min-h-96">
        {/* C'est ici que j'ajouterai la liste des tâches */}
      </div>
      <div className="p-3 bg-gray-50 rounded-b-lg">
        <button className="w-full text-left text-gray-500 hover:text-gray-700">
          + Add a card
        </button>
      </div>
    </div>
  );
};

export default ListComponent;
