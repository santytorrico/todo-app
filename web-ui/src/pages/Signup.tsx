import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignuo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-black text-2xl font-bold mb-4">Signup</h1>
        <form onSubmit={handleSignuo} className="flex flex-col gap-4">
          <input className="border p-2 rounded" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="border p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="border p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="bg-green-500 text-white py-2 rounded hover:bg-blue-600">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;