import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/schemas";
import TaskComponent from "./Task";

interface SortableTaskItemProps {
  task: Task;
  listId: string;
}

const SortableTaskItem: React.FC<SortableTaskItemProps> = ({
  task,
  listId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id, data: { listId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskComponent task={task} listId={listId} />
    </div>
  );
};

export default SortableTaskItem;
