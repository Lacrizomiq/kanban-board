import React, { useState } from "react";
import { Task, List } from "@/schemas";
import { useDeleteTask, useUpdateTask } from "@/hooks/useTasks";
import { useTags } from "@/hooks/useTags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/DatePicker";
import { X } from "lucide-react";

interface TaskModalProps {
  task: Task;
  lists: List[];
  boardId: string;
  onClose: () => void;
  onUpdate: (updatedTask: Partial<Task>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  lists,
  //boardId,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [selectedListId, setSelectedListId] = useState(task.listId);
  const [completed, setCompleted] = useState(task.completed);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [selectedTagId, setSelectedTagId] = useState<string | undefined>(
    task.tagId || undefined
  );

  /*
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<
    string | undefined
  >(task.assigneeId || undefined);
  */

  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();
  // const assignTaskMutation = useAssignTask();
  const { data: tags } = useTags();
  // const { data: users, isLoading: isLoadingUsers } = useBoardUsers(boardId);

  const handleSave = () => {
    const updatedTask: Partial<Task> = {
      id: task.id,
      title,
      description,
      listId: selectedListId,
      completed,
      dueDate: dueDate instanceof Date ? dueDate.toISOString() : dueDate,
      tagId: selectedTagId,
      // assigneeId: selectedAssigneeId,
    };

    updateTaskMutation.mutate(updatedTask, {
      onSuccess: () => {
        onUpdate(updatedTask);
        onClose();
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(
        { id: task.id, listId: task.listId },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  // const handleAssign = (userId: string) => {
  //   setSelectedAssigneeId(userId);
  //   if (userId) {
  //     assignTaskMutation.mutate(
  //       { id: task.id, assigneeId: userId },
  //       {
  //         onSuccess: (updatedTask) =>
  //           setSelectedAssigneeId(updatedTask.assigneeId),
  //       }
  //     );
  //   }
  // };

  const handleClearDate = () => {
    setDueDate(undefined);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
      <div className="h-full overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Task Details</h2>
          <Button variant="ghost" onClick={onClose}>
            <X />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* List */}
          <div>
            <label
              htmlFor="list"
              className="block text-sm font-medium text-gray-700 mb-"
            >
              List
            </label>
            <Select value={selectedListId} onValueChange={setSelectedListId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a list" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Completed */}
          <div className="flex items-center">
            <Checkbox
              id="completed"
              checked={completed}
              onCheckedChange={(checked) => setCompleted(checked as boolean)}
            />
            <label htmlFor="completed" className="ml-2 text-sm text-gray-700">
              Completed
            </label>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Due Date
            </label>
            <div className="mt-1 flex items-center">
              <DatePicker date={dueDate} setDate={setDueDate} />
              {dueDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearDate}
                  className="ml-2"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tag"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tag
            </label>
            <Select
              value={selectedTagId || undefined}
              onValueChange={(value) => setSelectedTagId(value || undefined)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-tag">No tag</SelectItem>
                {tags &&
                  tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: tag.color }}
                        ></div>
                        {tag.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleSave} className="flex-grow">
              Save Changes
            </Button>
            <Button onClick={handleDelete} variant="destructive">
              Delete Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
