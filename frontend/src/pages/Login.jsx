import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.dismiss();
      return toast.error(t("Please fill all fields!"));
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, id, username, email: userEmail, role } = response.data.data;

      const userData = {
        userId: id,
        role: role,
        username: username,
      };

      if (token && id) {
        login(token, userData, userEmail);
        toast.dismiss();
        toast.success(t("Welcome again!"));
        navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unknown Error";
      toast.dismiss();
      toast.error(`${JSON.stringify(message)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-white">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 md:px-24 py-8">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("Log in")}</h1>
          <p className="text-gray-600 font-semibold text-lg mb-1">{t("Welcome back")}</p>
          <p className="text-gray-400 text-sm mb-8">{t("Enter your Credentials to access your account")}</p>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">{t("Email Address")}</label>
              <input
                type="email"
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Enter your Email")}
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">{t("Password")}</label>
                <Link to="/login" size="sm" className="text-[10px] font-bold text-blue-600 hover:underline uppercase">
                  {t("forgot password")}
                </Link>
              </div>
              <input
                type="password"
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Password")}
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-gray-900 font-bold cursor-pointer">
                {t("Remember for 30 days")}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-bold transition-all mt-1 ${
                loading ? "bg-orange-300" : "bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-md shadow-orange-100"
              }`}
            >
              {loading ? t("Processing...") : t("Sign In")}
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase">{t("Or")}</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex gap-4">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition">
                <FcGoogle size={18} /> {t("Sign in with Google")}
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 transition">
                <FaApple size={18} /> {t("Sign in with Apple")}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-sm font-medium">
            <span className="text-gray-900 font-bold">{t("Don't have an account")} </span>
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              {t("Sign Up")}
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 p-4">
        <div
          className="w-full h-full rounded-[2.5rem] bg-cover bg-center overflow-hidden flex items-end justify-center"
          style={{
            backgroundImage: `url('/signup-login.jpg')`,
            backgroundColor: '#f3f4f6'
          }}
        >
          <div className="bg-black/10 w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}
