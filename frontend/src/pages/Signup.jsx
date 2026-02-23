import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.api";

import { CiUser } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { SlLock } from "react-icons/sl";
import { FaEye, FaRegEyeSlash, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import useAuthStore from "../store/useAuthStore";
import { useTranslation } from "react-i18next";

function SignUp() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const [showPass, setShowPass] = useState(false);
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
        login(token);
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
    const usernameTrmd = username.trim();
    const emailTrmd = email.trim();
    const passwordTrmd = password.trim();
    if (!usernameTrmd) {
      tempErrors.username = "Full Name is required";
      isValid = false;
    }
    if (!emailTrmd) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailTrmd)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }
    if (!passwordTrmd) {
      tempErrors.password = "Password is required";
      isValid = false;
    } else if (passwordTrmd.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    if (!checked) {
      tempErrors.terms = "You must accept terms";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const resetHandler = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setChecked(false);
    setErrors({});
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-zinc-100 p-2 sm:p-3">
      <div className="flex flex-col items-center justify-center text-center mb-4">
        {message?.text && (
          <p
            className={`mb-4 py-2 rounded-md w-full  px-14 ${
              message.type === "success"
                ? "bg-green-100 text-green-500"
                : " text-red-500"
            }   `}
          >
            {message.text}
          </p>
        )}
        <h1 className="text-xl font-bold">{t("create_account")}</h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
          {t("your_journey")}
        </p>
      </div>

      <form
        className="flex flex-col w-full max-w-[400px] gap-1 rounded-2xl border bg-white py-5 px-6 shadow-lg"
        onSubmit={signupUserHandler}
      >
        <div className="w-full">
          <label
            htmlFor="full-name"
            className="text-xs sm:text-sm font-medium text-gray-900"
          >
            {t("full_name")}
          </label>

          <div
            className={` flex w-full items-center rounded-xl border bg-zinc-100/50 px-2 focus-within:border-indigo-500  transition ${
              errors.username ? "border-red-500" : "border-gray-200"
            }`}
          >
            <CiUser
              className={`${
                errors.username ? "text-red-500" : "text-gray-800"
              }`}
              size={15}
            />
            <input
              id="full-name"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors((prev) => ({ ...prev, username: "" }));
              }}
              placeholder={t("john_doe")}
              className="w-full bg-transparent px-2 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>

          <span
            className={`block min-h-[10px] ml-2 text-[10px] font-medium transition-opacity duration-200 ${
              errors.username ? "text-red-500 opacity-100" : "opacity-0"
            }`}
          >
            {errors.username || " "}
          </span>
        </div>
        <div className="w-full">
          <label
            htmlFor="email"
            className="text-xs sm:text-sm font-medium text-gray-900 mt-2"
          >
            {t("email_address")}
          </label>
          <div
            className={`flex items-center w-full bg-zinc-100/50 border  rounded-xl px-2 focus-within:border-indigo-500  ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          >
            <AiOutlineMail
              className={`${errors.email ? "text-red-500" : "text-gray-800"}`}
              size={15}
            />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder={t("hello_example")}
              className="w-full bg-transparent px-2 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <span
            className={`block min-h-[10px] ml-2 text-[10px] font-medium transition-opacity duration-200 ${
              errors.email ? "text-red-500 opacity-100" : "opacity-0"
            }`}
          >
            {errors.email || " "}
          </span>
        </div>

        <div className="w-full">
          <label
            htmlFor="password"
            className="text-xs sm:text-sm font-medium text-gray-900 mt-2"
          >
            {t("password")}
          </label>
          <div
            className={`flex items-center w-full bg-zinc-100/50 border  rounded-xl px-2 focus-within:border-indigo-500 ${
              errors.password ? "border-red-500" : "border-gray-200"
            }`}
          >
            <SlLock
              className={`${
                errors.password ? "text-red-500" : "text-gray-800"
              }`}
              size={15}
            />
            <input
              id="password"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="••••••••"
              className="w-full bg-transparent px-2 py-2 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}>
              {showPass ? (
                <FaEye className="text-gray-500" size={13} />
              ) : (
                <FaRegEyeSlash className="text-gray-500" size={13} />
              )}
            </button>
          </div>
          <span
            className={`block min-h-[10px] ml-2 text-[10px] font-medium transition-opacity duration-200 ${
              errors.password ? "text-red-500 opacity-100" : "opacity-0"
            }`}
          >
            {errors.password || " "}
          </span>
        </div>

        <div className="w-full flex flex-col items-start">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  setChecked(e.target.checked);
                  setErrors((prev) => ({ ...prev, terms: "" }));
                }}
                className="sr-only"
              />

              <div
                className={`w-3.5 h-3.5 border-[1.5px] ${
                  checked ? "border-indigo-700" : "border-gray-400"
                } rounded-full flex items-center justify-center transition-all`}
              >
                {checked && (
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full transition-all"></span>
                )}
              </div>
            </div>
            <span className="ml-2 text-xs sm:text-sm text-gray-500 font-medium hover:text-indigo-500">
              {t("terms_agreement")}{" "}
              <span className="text-indigo-500">{t("terms_of_service")}</span>{" "}
              {t("and")} {"  "}
              <span className="text-indigo-500">{t("privacy_policy")}</span>
            </span>
          </label>
          <span
            className={`block  ml-5 text-[10px] font-medium transition-opacity duration-200 ${
              errors.terms ? "text-red-500 opacity-100" : "opacity-0"
            }`}
          >
            {errors.terms || " "}
          </span>
        </div>

        <button
          className={`w-full mt-4 rounded-xl  py-2 text-xs sm:text-sm text-white font-medium
            ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-700"
            }
          `}
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : t("sign_up")}
        </button>

        <div className="w-full flex items-center gap-2 mt-2 text-xs sm:text-sm  my-1">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-gray-500 whitespace-nowrap">
            {t("or_continue_with")}
          </span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        <div className="w-full flex gap-2">
          <button className="text-xs sm:text-sm flex-1 flex items-center justify-center gap-1 rounded-xl border py-2  font-semibold hover:bg-indigo-500 hover:text-white">
            <FcGoogle size={15} /> {t("google")}
          </button>
          <button className="text-xs sm:text-sm flex-1 flex items-center justify-center gap-1 rounded-xl border py-2  font-semibold hover:bg-indigo-500 hover:text-white">
            <FaApple size={15} /> {t("apple")}
          </button>
        </div>
      </form>

      <div className="flex gap-1 items-center justify-center mt-3 text-xs sm:text-sm">
        <p className=" text-gray-500 font-medium">
          {t("already_have_account")}
        </p>
        <Link
          to="/login"
          className="text-indigo-700 font-medium hover:underline"
        >
          {t("log_in")}
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
