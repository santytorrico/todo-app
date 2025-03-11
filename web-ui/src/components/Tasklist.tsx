import { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { Task } from "../store/taskStore"; // Import the Task type

type TaskListProps = {
  selectionMode: boolean;
  selectedTasks: Record<number, boolean>;
  toggleTaskSelection: (taskId: number) => void;
};

export const TaskList = ({ selectionMode, selectedTasks, toggleTaskSelection }: TaskListProps) => {
  const { tasks, updateTask, removeTask } = useTaskStore();
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  const handleSave = async (id: number) => {
    await updateTask(id, editedTitle, editedDescription, false); // Pass `false` for `completed` if not changing
    setEditingTaskId(null);
  };
  const handleCancel = () => {
    setEditingTaskId(null); // Exit editing mode without saving
  };
  const handleToggleComplete = async (id: number, completed: boolean) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      await updateTask(id, task.title, task.description, !completed);
    }
  };

  return (
    <ul className="mt-6 w-full grid gap-3">
      {tasks.map((task) => (
        <li key={task.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-2">
            {selectionMode && (
              <input
                type="checkbox"
                checked={!!selectedTasks[task.id]}
                onChange={() => toggleTaskSelection(task.id)}
                className="h-5 w-5 accent-blue-500"
              />
            )}
            {editingTaskId === task.id ? (
              <input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="border p-2 rounded w-full"
              />
            ) : (
              <h3 className={`text-lg font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
                {task.title}
              </h3>
            )}
          </div>
          
          {editingTaskId === task.id ? (
            <div className="mb-4">
              <input
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleSave(task.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                  Save
                </button>
                <button onClick={handleCancel} className="bg-gray-500 text-white px-3 py-1 rounded text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">{task.description}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleToggleComplete(task.id, task.completed)}
                  className={`text-sm px-3 py-1 rounded-full text-white ${
                    task.completed ? "bg-yellow-500" : "bg-green-500"
                  }`}
                >
                  {task.completed ? "Incomplete" : "Complete"}
                </button>
                <button onClick={() => handleEdit(task)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full">
                  Edit
                </button>
                <button onClick={() => removeTask(task.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">
                  Delete
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};