import React, { useState } from "react";
import { Task } from "@/schemas";
import { useUpdateTask, useDeleteTask, useAssignTask } from "@/hooks/useTasks";
import { PencilIcon, TrashIcon } from "@/components/Icons/Icons";

interface TaskProps {
  task: Task;
  listId: string;
}

const TaskComponent: React.FC<TaskProps> = ({ task, listId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(
    task.description || ""
  );
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const assignTaskMutation = useAssignTask();

  const handleUpdateTask = () => {
    if (
      editedTitle.trim() &&
      (editedTitle !== task.title || editedDescription !== task.description)
    ) {
      updateTaskMutation.mutate(
        { id: task.id, title: editedTitle, description: editedDescription },
        { onSuccess: () => setIsEditing(false) }
      );
    } else {
      setIsEditing(false);
    }
  };

  const handleDeleteTask = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate({ id: task.id, listId });
    }
  };

  const handleToggleComplete = () => {
    updateTaskMutation.mutate({ id: task.id, completed: !task.completed });
  };

  const handleAssignTask = (assigneeId: string) => {
    assignTaskMutation.mutate({ id: task.id, assigneeId });
  };

  return (
    <div
      className={`bg-white p-2 mb-2 rounded shadow ${
        task.completed ? "opacity-50" : ""
      }`}
    >
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full p-1 mb-2 border rounded"
            autoFocus
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full p-1 mb-2 border rounded"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleUpdateTask}
              className="px-2 py-1 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className={task.completed ? "line-through" : ""}>
              {task.title}
            </span>
            <div className="space-x-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                className="mr-2"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteTask}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          {task.description && (
            <p className="text-sm text-gray-600">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="text-sm text-gray-500 mt-1">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
          {task.assignee && (
            <p className="text-sm text-blue-500 mt-1">
              Assigned to: {task.assignee.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskComponent;
