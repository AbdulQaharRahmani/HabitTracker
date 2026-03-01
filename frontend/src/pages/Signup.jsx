import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.api";

import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useAuthStore from "../store/useAuthStore";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { t } = useTranslation();
  const { login } = useAuthStore();

  const signupUserHandler = async (e) => {
    e.preventDefault();
    if (loading) return;
    setMessage(null);
    if (!formValidation()) return;
    setLoading(true);
    try {
      const res = await registerUser({
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      setMessage({ text: res.message, type: "success" });
      if (res.token) {
        login(res.token);
      }
      resetHandler();
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      setMessage({
        text: err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formValidation = () => {
    let tempErrors = {};
    let isValid = true;
    if (!username.trim()) {
      tempErrors.username = "Name is required";
      isValid = false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Valid email is required";
      isValid = false;
    }
    if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      toast.error(t("Passwords do not match"));
      isValid = false;
    }
    if (!checked) {
      tempErrors.terms = "Please agree to terms";
      toast.error(t("Please agree to terms"));
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const resetHandler = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setChecked(false);
    setErrors({});
  };

  return (
    <div className="flex w-full min-h-screen bg-white">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 md:px-24 py-8">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("Sign Up")}</h1>
          <p className="text-gray-600 font-semibold text-lg mb-4">{t("Get Started Now")}</p>

          {message?.text && (
            <div className={`mb-4 p-3 rounded text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={signupUserHandler}>
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">{t("Full Name")}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("Enter your Name")}
                className={`w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors.username ? "border-red-500" : "border-gray-300"}`}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">{t("Email Address")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("Enter your Email")}
                className={`w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">{t("Password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("Password")}
                className={`w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-gray-700">{t("Confirm password")}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("Confirm password")}
                className={`w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
              />
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="w-4 h-4 accent-orange-500 cursor-pointer"
              />
              <span className="text-xs text-gray-700 font-medium">
                {t("I agree to the")} <span className="underline cursor-pointer">{t("terms & policy")}</span>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-bold transition-all mt-1 ${
                loading ? "bg-orange-300" : "bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
              }`}
            >
              {loading ? "Processing..." : t("Sign Up")}
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">{t("OR")}</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex gap-4">
              <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-1 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                <FcGoogle size={18} /> {t("Sign in with Google")}
              </button>
              <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-1 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                <FaApple size={18} /> {t("Sign in with Apple")}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-gray-900">{t("Have an account")}? </span>
            <Link to="/login" className="text-orange-600 hover:underline">
              {t("Sign In")}
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 p-4">
        <div
          className="w-full h-full rounded-3xl bg-cover bg-center overflow-hidden flex items-end justify-center"
          style={{ backgroundImage: `url('/signup-login.jpg')`, backgroundColor: '#f3f4f6' }}
        >
          <div className="bg-black/20 w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
