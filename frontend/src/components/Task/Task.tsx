import React from "react";
import { Task } from "@/schemas";

interface TaskComponentProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task, onClick }) => {
  const handleClick = () => {
    console.log("Task clicked:", task);
    onClick(task);
  };

  return (
    <div
      className="bg-white p-2 mb-2 rounded shadow cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <h4 className="font-semibold">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-gray-600">{task.description}</p>
      )}
    </div>
  );
};

export default TaskComponent;
