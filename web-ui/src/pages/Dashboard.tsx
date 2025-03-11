import { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { TaskList } from "../components/Tasklist";

const Dashboard = () => {
  const { tasks, summary, isSummarizing, fetchTasks, addTask, generateSummary } = useTaskStore();
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
      <h1 className="text-black text-3xl font-bold mb-6">To Do Dashboard</h1>
      
      <div className="flex gap-4 w-full rounded shadow-lg p-6 bg-white border border-gray-200">
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-3 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Task description..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          className="border p-3 rounded-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleAddTask} 
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition duration-300"
        >
          Add Task
        </button>
      </div>

      <div className="flex gap-2 mt-4 w-full">
        <button 
          onClick={handleSummarizeAll} 
          className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 "
          disabled={isSummarizing || tasks.length === 0}
        >
          Summarize All Tasks
        </button>
        
        <button 
          onClick={() => setSelectionMode(!selectionMode)} 
          className={`px-4 py-2 rounded-full ${selectionMode ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
        >
          {selectionMode ? 'Exit Selection Mode' : 'Select Tasks to Summarize'}
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
          {summary.includes("Suggested Schedule:") ? (
            <>
              <p>{summary.split("Suggested Schedule:")[0]}</p>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-bold text-md mb-1">Suggested Schedule:</h4>
                <p>{summary.split("Suggested Schedule:")[1]}</p>
              </div>
            </>
          ) : (
            <p>{summary}</p>
          )}
        </div>
      )}
      <TaskList
        selectionMode={selectionMode}
        selectedTasks={selectedTasks}
        toggleTaskSelection={toggleTaskSelection}
      />
    </div>
  );
};

export default Dashboard;