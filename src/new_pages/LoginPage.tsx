import { useState } from "react";
import { User, LogOut } from "lucide-react";
import LoginForm from "../components/login-register/LoginForm";
import RegisterForm from "../components/login-register/RegisterForm";

interface UserData {
  name: string;
  email: string;
}
interface LoginPageProps {
  initialView: "login" | "register";
}

const LoginPage: React.FC<LoginPageProps> = ({ initialView = "login" }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(initialView === "login");
  const [user, setUser] = useState<UserData | null>(null);

  const handleLoginSuccess = (userData: UserData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleRegisterSuccess = (userData: UserData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-teal-100">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* User Info & Logout */}
          {isLoggedIn && user && (
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="flex items-center gap-3 bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-white/20 p-1.5 rounded-full">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto">
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-8 bg-white/60 backdrop-blur-sm p-1.5 rounded-2xl shadow-lg">
              <button
                onClick={() => setShowLogin(true)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  showLogin
                    ? "bg-teal-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  !showLogin
                    ? "bg-teal-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Register
              </button>
            </div>

            {/* Render Login or Register Form */}
            {showLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-500 rounded-full mb-6 shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome, {user?.name}!
              </h2>
              <p className="text-gray-600 text-lg">
                You're successfully logged in to your account.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LoginPage;
