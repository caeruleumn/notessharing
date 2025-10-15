"use client";

import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function CreateNotePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notes", { title, content });
      setMessage("Catatan berhasil dibuat!");
      setTimeout(() => router.push("/notes"), 800);
    } catch (err) {
      setMessage("Gagal membuat catatan.");
    }
  };

  return (
    <div className="page flex items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="card-title text-center">Tambah Catatan</h1>

        {message && (
          <div className="alert-success mb-4">{message}</div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required
          />
          <textarea
            placeholder="Isi catatan"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input h-28"
            required
          ></textarea>

          <button className="btn-primary w-full">Simpan</button>
        </form>

        <button
          onClick={() => router.push("/notes")}
          className="link w-full mt-4"
        >
          ← Kembali
        </button>
      </div>
    </div>
  );
}
