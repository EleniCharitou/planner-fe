import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      await register({
        email: registerData.email,
        password: registerData.password,
        first_name: registerData.first_name,
        last_name: registerData.last_name,
      });

      // After successful registration and auto-login, redirect to home
      navigate("/", { replace: true });
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 animate-slide-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-2xl mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-600 mt-2">
          Join us to start planning your trips
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={registerData.first_name}
              onChange={(e) =>
                setRegisterData({ ...registerData, first_name: e.target.value })
              }
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 outline-none text-black"
              placeholder="John"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={registerData.last_name}
              onChange={(e) =>
                setRegisterData({ ...registerData, last_name: e.target.value })
              }
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 outline-none text-black"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              onKeyDown={handleKeyDown}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 outline-none text-black"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              onKeyDown={handleKeyDown}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 outline-none text-black"
              placeholder="At least 8 characters"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                })
              }
              onKeyDown={handleKeyDown}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 outline-none text-black"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 bg-teal-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
