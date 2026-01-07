import { useEffect, useState } from "react";
import { useTaskStore } from "../store/taskStore";
import { useAuthStore } from "../store/authStore";
import { TaskList } from "../components/Tasklist";

const Dashboard = () => {
  const { tasks, summary, isSummarizing, fetchTasks, addTask, generateSummary } = useTaskStore();
  const { token } = useAuthStore();
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<Record<number, boolean>>({});
  const [selectionMode, setSelectionMode] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask(newTask, newDescription);
    setNewTask("");
    setNewDescription("");
    setIsAddingTask(false);
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
    <div className="flex flex-col items-center w-full min-h-screen px-4 md:px-6">
      <h1 className="text-black text-2xl md:text-3xl font-bold my-4 md:my-6">To Do Dashboard</h1>
      
      {/* Mobile-friendly task input */}
      <div className="w-full mb-4">
        {isAddingTask ? (
          <div className="flex flex-col gap-3 w-full rounded-lg shadow-lg p-4 bg-white border border-gray-200">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Task description..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="border p-3 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setIsAddingTask(false)} 
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddTask} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Task
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingTask(true)} 
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Task
          </button>
        )}
      </div>

      {/* Summary Controls - Stack vertically on mobile */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
        <button 
          onClick={handleSummarizeAll} 
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition w-full sm:w-auto"
          disabled={isSummarizing || tasks.length === 0}
        >
          Summarize All Tasks
        </button>
        
        <button 
          onClick={() => setSelectionMode(!selectionMode)} 
          className={`px-4 py-2 rounded-lg ${selectionMode ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} text-white transition w-full sm:w-auto`}
        >
          {selectionMode ? 'Exit Selection Mode' : 'Select Tasks to Summarize'}
        </button>
        
        {selectionMode && (
          <button 
            onClick={handleSummarizeSelected} 
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition w-full sm:w-auto"
            disabled={isSummarizing || Object.values(selectedTasks).filter(Boolean).length === 0}
          >
            Summarize Selected
          </button>
        )}
      </div>

      {/* Summary Display */}
      {isSummarizing && (
        <div className="w-full mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating AI summary...</span>
          </div>
        </div>
      )}

      {summary && !isSummarizing && (
        <div className="w-full mb-4 bg-white rounded-lg border border-blue-200 shadow-sm overflow-hidden">
          <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
            <h3 className="font-medium text-blue-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              AI Summary
            </h3>
          </div>
          <div className="p-4">
            {summary.includes("Suggested schedule:") ? (
              <>
                <div className="text-sm md:text-base mb-4">
                  {summary.split("Suggested schedule:")[0]}
                </div>
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Suggested Schedule
                  </h4>
                  <div className="text-sm md:text-base pl-2 border-l-2 border-green-300">
                    {summary.split("Suggested schedule:")[1]}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm md:text-base">{summary}</p>
            )}
          </div>
        </div>
      )}

      {/* Task List */}
      <TaskList
        selectionMode={selectionMode}
        selectedTasks={selectedTasks}
        toggleTaskSelection={toggleTaskSelection}
      />
    </div>
  );
};

export default Dashboard;