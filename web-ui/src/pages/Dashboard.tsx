import { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";

const Dashboard = () => {
  const { tasks, fetchTasks, addTask, toggleTask, removeTask } = useTaskStore();
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask(newTask);
    setNewTask("");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Task Dashboard</h1>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </div>

      <ul className="mt-6 w-full max-w-md">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2">
            <span className={task.completed ? "line-through" : ""}>{task.title}</span>
            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(task.id, !task.completed)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => removeTask(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;