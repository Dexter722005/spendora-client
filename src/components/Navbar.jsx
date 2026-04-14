import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const nav = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => nav("/dashboard")}
          >
            <span className="text-3xl mr-2 transform group-hover:scale-110 transition">💰</span>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Spendora
            </span>
          </div>

          <div className="flex items-center space-x-4 md:space-x-8">
            <button
              onClick={() => nav("/dashboard")}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
            >
              Dashboard
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? "🌙" : "☀️"}
            </button>

            <button
              onClick={logout}
              className="bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-5 py-2 rounded-xl font-bold transition transform hover:scale-105 active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}