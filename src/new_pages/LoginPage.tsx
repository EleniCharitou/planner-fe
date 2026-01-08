import { useState } from "react";
import { User } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-teal-100">
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
