import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const sampleUser = {
    userEmail: "shukriasul5@gmail.com",
    userPassword: "Shukria@123",
};

export default function Login() {
    const [passwordType, setPasswordType] = useState("password");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePasswordVisibility = () => {
        setPasswordType((prev) => (prev === "password" ? "text" : "password"));
    };
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) return alert("Please fill all fields!");
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            if (
                sampleUser.userEmail === email &&
                sampleUser.userPassword === password
            ) {
                alert("Success! 🎉");
                navigate("/");
            } else {
                alert("Invalid email or password!");
            }
        } catch (error) {
            console.log(`Could not login ${error}`);
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
                style={{ borderColor: "#7B68EE" }}
            >
                <div className="flex flex-col items-center mb-10">
                    <div
                        className="p-5 rounded-2xl mb-4 rotate-3 animate-bounce "
                        style={{ backgroundColor: "#7B68EE" }}
                    >
                        <FaUser className="text-white text-4xl " />
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase">Login</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <fieldset disabled={loading} className="space-y-5">
                        {/* Email Input */}
                        <div className="relative ">
                            <MdEmail
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl"
                                style={{ color: "#7B68EE" }}
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#7B68EE] outline-none transition-all font-medium shadow-inner"
                            />
                        </div>
                        {/* Password Input */}
                        <div className="relative ">
                            <MdLock
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl"
                                style={{ color: "#7B68EE" }}
                            />
                            <input
                                type={passwordType}
                                placeholder="Your Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#7B68EE] outline-none transition-all font-medium shadow-inner"
                            />
                            <button
                                type="button"
                                onClick={handlePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7B68EE]"
                            >
                                {passwordType === "password" ? (
                                    <FaEyeSlash size={22} />
                                ) : (
                                    <FaEye size={22} />
                                )}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl font-black text-white uppercase transform transition-all hover:brightness-110"
                            style={{
                                backgroundColor: loading ? "#9CA3AF" : "#7B68EE",
                            }}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}