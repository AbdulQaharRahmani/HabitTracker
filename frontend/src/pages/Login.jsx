import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";

export default function Login() {
  const [passwordType, setPasswordType] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

    const handlePasswordVisibility = () => {
        setPasswordType((prev) => (prev === "password" ? "text" : "password"));
    };
    const navigate = useNavigate();
    const {login} = useAuthStore()
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return toast.error("Please fill all fields!");
        setLoading(true);
        try {
        const response = await api.post("/auth/login", { email, password })
        const { token, id } = response.data.data;
        console.log(token,id);
        if (token && id) {
        login(token, id);
        toast.success("Welcome again!");
        navigate("/");
       }
        } catch (error) {
            console.log(`Could not login ${error}`);
            const message = error.response?.data?.message || error.response?.data?.error || "Unknown Error";
            toast.error(`${JSON.stringify(message)}`)
        } finally {
            setLoading(false);
        }
    };
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: "#F0F8FF" }}
        >
            <div
                className="bg-white p-10 rounded-[2rem]  w-full max-w-md shadow-[0_20px_50px_rgba(123,104,238,0.2),_0_-10px_30px_rgba(0,212,170,0.1)] hover:shadow-[0_30px_60px_rgba(123,104,238,0.3),_0_-10px_30px_rgba(0,212,170,0.15)]
        transition-all"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div
            className="p-5 rounded-2xl mb-4 rotate-3 animate-bounce
            bg-[#7B68EE]"
          >
            <FaUser className="text-white text-4xl" />
          </div>
          <h1
            className="text-3xl font-black uppercase
            text-gray-800 dark:text-white"
          >
            Login
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <fieldset disabled={loading} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <MdEmail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl
                  text-[#7B68EE]"
              />
              <input
                type="email"
                required
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl font-medium outline-none
                  bg-gray-50 dark:bg-gray-800
                  text-gray-800 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  border-2 border-transparent
                  focus:bg-white dark:focus:bg-gray-900
                  focus:border-[#7B68EE]
                  shadow-inner transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <MdLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl
                  text-[#7B68EE]"
              />
              <input
                type={passwordType}
                required
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl font-medium outline-none
                  bg-gray-50 dark:bg-gray-800
                  text-gray-800 dark:text-white
                  placeholder-gray-400 dark:placeholder-gray-500
                  border-2 border-transparent
                  focus:bg-white dark:focus:bg-gray-900
                  focus:border-[#7B68EE]
                  shadow-inner transition-all"
              />
              <button
                type="button"
                onClick={handlePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-[#7B68EE]"
              >
                {passwordType === "password" ? (
                  <FaEyeSlash size={22} />
                ) : (
                  <FaEye size={22} />
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-black uppercase
                text-white transition-all transform
                bg-[#7B68EE] hover:brightness-110
                disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
