import { useState } from "react"
import { useNavigate } from "react-router-dom";

const ForgotPassword = () =>{
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  
  const handleForgotpassword = async (e: React.FormEvent) => {
    alert("Function triggered!");
    e.preventDefault();
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
          <h1 className="flex justify-center text-black text-2xl font-bold mb-4">Forgot Your Password?</h1>
          <p className="flex justify-center mb-4 text-sm"> No worries, we'll send you reset instructions</p>
          <form onSubmit={handleForgotpassword} className="flex flex-col gap-4">
            <input className="border p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit" className="bg-slate-700  text-white border p-2 rounded hover:bg-slate-800"> Send Recovery</button>
          </form>
          <p className="mt-4 text-sm text-gray-600">
            Go back to{" "} 
            <button onClick={() => navigate("/login")} className="text-blue-500 underline">
              Login
            </button>
          </p>
        </div>
      </div>
  );
}
export default ForgotPassword;