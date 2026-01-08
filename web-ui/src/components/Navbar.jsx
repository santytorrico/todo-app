import { Link } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Navbar = ({ children }) => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login"); // Redirect to login after logging out
    };
    return (
        <div className="flex flex-col min-h-screen">
            <nav className="bg-blue-500 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
                <h1 className="text-lg font-bold">To-Do App</h1>
                <div className="flex gap-4">
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <button onClick={handleLogout} className="hover:underline">Logout</button>
                </div>
            </nav>
            <main className="flex-grow p-6 mt-16">{children}</main>
        </div>
    )
}
export default Navbar;