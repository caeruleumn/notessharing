"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter, useParams } from "next/navigation";

export default function EditNotePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Ambil ID dari URL

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  // Ambil catatan berdasarkan ID saat pertama kali masuk halaman
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get("/notes");
        const note = res.data.find((n) => n.id == id); // cari catatan by id
        if (!note) return setMessage("Catatan tidak ditemukan");

        setTitle(note.title);
        setContent(note.content);
      } catch {
        setMessage("Gagal mengambil data catatan");
      }
    };

    fetchNote();
  }, [id]);

  // UPDATE catatan
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/notes/${id}`, { title, content });
      setMessage("Catatan berhasil diperbarui!");
      setTimeout(() => router.push("/notes"), 800);
    } catch {
      setMessage("Gagal memperbarui catatan.");
    }
  };

  return (
    <div className="page flex items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="card-title text-center">Edit Catatan</h1>

        {message && (
          <div className="alert-info mb-4">{message}</div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input h-28"
            required
          ></textarea>

          <button className="btn-primary w-full">Update</button>
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

