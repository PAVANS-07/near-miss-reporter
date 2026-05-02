import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleRegister = async () => {
    if (!username || !password) {
      toast.error("Fill all fields");
      return;
    }

    try {
      const res = await api.post("/auth/register", { username, password });
      toast.success(res.data);
      setTimeout(() => (window.location.href = "/"), 1000);
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-80">
        <h2 className="text-xl font-bold text-center mb-4 dark:text-white">
          📝 Register
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

        <button onClick={handleRegister} className="btn-success w-full">
          Register
        </button>

        <p className="text-center mt-3 dark:text-white">
          Already have account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}