import { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";

const Dashboard = () => {
  const { tasks, summary, isSummarizing, fetchTasks, addTask, toggleTask, removeTask, generateSummary } = useTaskStore();
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<Record<number, boolean>>({});
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask(newTask, newDescription);
    setNewTask("");
    setNewDescription("");
  };

  const handleSummarizeAll = () => {
    generateSummary();
  };

  const handleSummarizeSelected = () => {
    const selectedTaskIds = Object.entries(selectedTasks)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => parseInt(id));
    
    generateSummary(selectedTaskIds);
  };

  const toggleTaskSelection = (taskId: number) => {
    setSelectedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-6">
      <h1 className="text-black text-3xl font-bold mb-6">Task Dashboard</h1>
      
      <div className="flex gap-2 w-full">
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <textarea
          placeholder="Task description..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="border p-2 rounded flex-grow"
        />
        <button 
          onClick={handleAddTask} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      <div className="flex gap-2 mt-4 w-full">
        <button 
          onClick={handleSummarizeAll} 
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          disabled={isSummarizing || tasks.length === 0}
        >
          Summarize All Tasks
        </button>
        
        <button 
          onClick={() => setSelectionMode(!selectionMode)} 
          className={`px-4 py-2 rounded ${selectionMode ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
        >
          {selectionMode ? 'Exit Selection Mode' : 'Select Tasks'}
        </button>
        
        {selectionMode && (
          <button 
            onClick={handleSummarizeSelected} 
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            disabled={isSummarizing || Object.values(selectedTasks).filter(Boolean).length === 0}
          >
            Summarize Selected
          </button>
        )}
      </div>

      {isSummarizing && (
        <div className="w-full mt-4 p-3 bg-gray-100 rounded text-center">
          Generating summary...
        </div>
      )}

      {summary && !isSummarizing && (
        <div className="w-full mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded shadow-sm">
          <h3 className="font-bold text-lg mb-2">Summary</h3>
          <p>{summary}</p>
        </div>
      )}

      <ul className="mt-6 w-full">
        {tasks.map((task) => (
          <li key={task.id} className="text-black flex flex-col justify-between items-center bg-white p-4 rounded-lg shadow mb-2">
            <div className="flex w-full justify-between">
              {selectionMode && (
                <input
                  type="checkbox"
                  checked={!!selectedTasks[task.id]}
                  onChange={() => toggleTaskSelection(task.id)}
                  className="mr-2"
                />
              )}
              <span className={task.completed ? "line-through" : ""}>{task.title}</span>
            </div>
            <p className="text-gray-600 mt-2 mb-2 w-full">{task.description}</p>
            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(task.id, !task.completed)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button
                onClick={() => removeTask(task.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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