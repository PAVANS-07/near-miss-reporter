import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      username,
      password,
    });

    if (res.data === "Login successful") {
      localStorage.setItem("user", username); // ✅ store user
      window.location.href = "/home";         // ✅ redirect
    } else {
      alert(res.data);
    }
  } catch (err) {
    alert("Login failed");
  }
};

  return (
    <div className="flex flex-col items-center mt-20 gap-4">
      <h2 className="text-2xl font-bold">Login</h2>

      <input
        type="text"
        placeholder="Username"
        className="border p-2"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Login
      </button>
      <p>
  Don't have an account?{" "}
  <span
    onClick={() => (window.location.href = "/register")}
    className="text-blue-500 cursor-pointer"
  >
    Register
  </span>
</p>
    </div>
  );
}