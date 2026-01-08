import { useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { Task } from "../store/taskStore";

export const TaskList = ({ selectionMode, selectedTasks, toggleTaskSelection }) => {
  const { tasks, updateTask, removeTask } = useTaskStore();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  const handleSave = async (id) => {
    await updateTask(id, editedTitle, editedDescription, false); // Pass `false` for `completed` if not changing
    setEditingTaskId(null);
  };
  const handleCancel = () => {
    setEditingTaskId(null); // Exit editing mode without saving
  };
  const handleToggleComplete = async (id, completed) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      await updateTask(id, task.title, task.description, !completed);
    }
  };
  if (tasks.length === 0) {
    return (
      <div className="mt-6 w-full bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
        <p className="text-gray-500">No tasks yet. Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <h2 className="text-lg md:text-xl font-semibold mb-3">Your Tasks</h2>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No tasks yet. Add your first task to get started!</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {tasks.map((task) => (
            <li key={task.id} className="bg-white p-3 md:p-4 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition">
              <div className="flex items-start gap-2">
                {selectionMode && (
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      checked={!!selectedTasks[task.id]}
                      onChange={() => toggleTaskSelection(task.id)}
                      className="h-4 w-4 accent-blue-500"
                    />
                  </div>
                )}
                
                <div className="flex-grow">
                  {editingTaskId === task.id ? (
                    <div className="space-y-3">
                      <input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task title"
                      />
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="border p-2 rounded w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task description"
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={handleCancel} 
                          className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => handleSave(task.id)} 
                          className="bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 text-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1 mb-3">{task.description}</p>
                      )}
                    </>
                  )}
                </div>
                
                {editingTaskId !== task.id && (
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => handleToggleComplete(task.id, task.completed)}
                      className={`p-1.5 rounded-md ${task.completed ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                      title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1.5 rounded-md bg-blue-100 text-blue-700"
                      title="Edit task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="p-1.5 rounded-md bg-red-100 text-red-700"
                      title="Delete task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};