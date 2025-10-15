"use client";

import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { username, password });
      // Save token to localStorage for API calls
      localStorage.setItem("token", res.data.token);

      // Also set a cookie so Next.js middleware (server-side) can see the token on page navigation
      // Use a 24-hour max-age. If running under HTTPS, include Secure flag.
      try {
        const token = res.data.token;
        const maxAge = 24 * 60 * 60; // 24 hours in seconds
        let cookie = `token=${token}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
        if (typeof window !== "undefined" && window.location.protocol === "https:") {
          cookie += "; Secure";
        }
        document.cookie = cookie;
      } catch (cookieErr) {
        // ignore cookie errors in very old browsers
        console.warn("Failed to set auth cookie", cookieErr);
      }

      router.push("/notes");
    } catch (err) {
      setError("Login gagal, periksa username atau password.");
    }
  };

  return (
    <div className="page flex items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="card-title text-center">Login</h1>

        {error && <div className="alert-error mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button className="btn-primary w-full">Login</button>
        </form>

        <p className="text-center mt-4 text-sm text-slate-600">
          Belum punya akun?{" "}
          <a href="/register" className="link">
            Register di sini
          </a>
        </p>
      </div>
    </div>
  );
}

