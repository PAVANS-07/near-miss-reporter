import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", { username, password });

      if (res.data === "Login successful") {
        toast.success("Login successful");
        localStorage.setItem("user", username);
        setTimeout(() => (window.location.href = "/home"), 1000);
      } else {
        toast.error(res.data);
      }
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-80">
        <h2 className="text-xl font-bold text-center mb-4 dark:text-white">
          🔐 Login
        </h2>

        <input
          placeholder="Username"
          className="input mb-3"
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={show ? "text" : "password"}
            placeholder="Password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2 cursor-pointer"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button onClick={handleLogin} className="btn-primary w-full">
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center mt-3 dark:text-white">
          No account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => (window.location.href = "/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}