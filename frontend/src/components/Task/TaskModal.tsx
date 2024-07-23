import React, { useState } from "react";
import { Task, List } from "@/schemas";

interface TaskModalProps {
  task: Task;
  lists: List[];
  onClose: () => void;
  onUpdate: (updatedTask: Partial<Task>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  lists,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [selectedListId, setSelectedListId] = useState(task.listId);

  const handleSave = () => {
    onUpdate({
      id: task.id,
      title,
      description,
      listId: selectedListId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Modifier la tâche</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Titre de la tâche"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Description de la tâche"
        />
        <select
          value={selectedListId}
          onChange={(e) => setSelectedListId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          {lists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Enregistrer
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
