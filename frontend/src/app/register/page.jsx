"use client";

import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { username, password });
      setMessage("Berhasil daftar! Mencoba login otomatis...");

      // coba login otomatis setelah registrasi
      try {
        const res = await api.post("/login", { username, password });
        localStorage.setItem("token", res.data.token);
        setMessage("Login otomatis berhasil. Mengarahkan ke notes...");
        setTimeout(() => router.push("/notes"), 800);
      } catch (err) {
        // jika auto-login gagal, arahkan ke halaman login
        setMessage("Registrasi berhasil. Silakan login.");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch {
      setMessage("Gagal register. Username mungkin sudah digunakan.");
    }
  };

  return (
    <div className="page flex items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="card-title text-center">Register</h1>

        {message && <div className="alert-info mb-4">{message}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
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
          <button className="btn-primary w-full">Register</button>
        </form>
        <p className="text-center mt-4 text-sm text-slate-600">
          Sudah punya akun?{" "}
          <a href="/login" className="link">
            Login di sini
          </a>
        </p>
      </div>
    </div>
  );
}

