import { useState } from "react";
import LoginForm from "../../components/login-register/LoginForm";
import RegisterForm from "../../components/login-register/RegisterForm";

interface LoginPageProps {
  initialView: "login" | "register";
}

const LoginPage: React.FC<LoginPageProps> = ({ initialView = "login" }) => {
  const [showLogin, setShowLogin] = useState(initialView === "login");

  return (
    <div className="min-h-screen bg-teal-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
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
                showLogin
                  ? "text-gray-600 hover:text-gray-900"
                  : "bg-teal-500 text-white shadow-md"
              }`}
            >
              Register
            </button>
          </div>

          {/* Render Login or Register Form */}
          {showLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
