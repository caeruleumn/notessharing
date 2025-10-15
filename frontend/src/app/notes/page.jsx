"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState(null);
  const router = useRouter();

  const fetchNotes = async () => {
    try {
      console.log("🚀 Fetching notes...");
      const res = await api.get("/notes");
      console.log("✅ Data diterima:", res.data);
      setNotes(res.data || []);
    } catch (err) {
      console.error("❌ Gagal fetch notes:", err);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Kalau gak ada token → langsung redirect (tanpa cek sesi)
    if (!token) {
      router.replace("/login");
      return;
    }

    // ✅ Decode token untuk ambil user_id
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.user_id);
      fetchNotes(); // 🚀 Langsung fetch tanpa delay
    } catch (err) {
      console.error("⚠ Token tidak valid, redirect...");
      router.replace("/login");
    }
  }, []);

  const logout = () => {
    try {
      // Hapus token di localStorage
      localStorage.removeItem("token");
      // Hapus cookie token (Path=/ agar global)
      let cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
      if (typeof window !== "undefined" && window.location.protocol === "https:") {
        cookie += "; Secure";
      }
      document.cookie = cookie;
    } catch (e) {
      console.warn("Gagal menghapus token/cookie saat logout", e);
    }
    router.replace("/login");
  };

  if (loading) return <p className="text-center mt-10">Memuat catatan...</p>;

  const deleteNote = async (id) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      alert("Gagal menghapus note.");
    }
  };

  const openModal = (note) => {
    setModalNote(note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalNote(null);
  };

  const myNotes = notes.filter((n) => n.user_id === currentUserId);
  const otherNotes = notes.filter((n) => n.user_id !== currentUserId);

  return (
    <div className="page">
      <div className="container-app py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Semua Catatan</h1>
            <p className="text-sm text-slate-600">Kelola catatanmu dengan nyaman</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/notes/create")}
              className="btn-primary"
            >
              + Tambah Note
            </button>
            <button onClick={logout} className="btn-danger">Logout</button>
          </div>
        </div>

        {/* Catatan Saya */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">Catatan Saya</h2>
            <span className="text-xs text-slate-500">{myNotes.length} item</span>
          </div>
          {myNotes.length === 0 ? (
            <p className="text-slate-500">Belum ada catatan milikmu.</p>
          ) : (
            <div className="space-y-4">
              {myNotes.map((note) => (
                <div key={note.id} className="card">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-base font-semibold text-slate-900">
                      {note.title}
                      <span className="badge-mine ml-2">Catatanmu ✅</span>
                    </h3>
                    <span className="text-xs text-slate-500">👤 {note.username}</span>
                  </div>
                  <p className="text-slate-700 mt-2">
                    {note.content && note.content.length > 160
                      ? `${note.content.slice(0, 160)}…`
                      : note.content}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openModal(note)}
                      className="btn-primary"
                    >
                      Lihat
                    </button>
                    <button
                      onClick={() => router.push(`/notes/edit/${note.id}`)}
                      className="btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="btn-danger"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Catatan Lainnya */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-900">Catatan Lainnya</h2>
            <span className="text-xs text-slate-500">{otherNotes.length} item</span>
          </div>
          {otherNotes.length === 0 ? (
            <p className="text-slate-500">Belum ada catatan dari pengguna lain.</p>
          ) : (
            <div className="space-y-4">
              {otherNotes.map((note) => (
                <div key={note.id} className="card">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-base font-semibold text-slate-900">{note.title}</h3>
                    <span className="text-xs text-slate-500">👤 {note.username}</span>
                  </div>
                  <p className="text-slate-700 mt-2">
                    {note.content && note.content.length > 160
                      ? `${note.content.slice(0, 160)}…`
                      : note.content}
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openModal(note)}
                      className="btn-primary"
                    >
                      Lihat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal Detail Note */}
      {modalOpen && modalNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/50" onClick={closeModal} />
          <div className="relative z-10 card w-full max-w-xl mx-4">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{modalNote.title}</h3>
              <button onClick={closeModal} className="btn-secondary">Tutup</button>
            </div>
            <div className="mt-1 text-xs text-slate-500">👤 {modalNote.username}</div>
            <div className="mt-4 whitespace-pre-wrap text-slate-800">{modalNote.content}</div>
          </div>
        </div>
      )}
    </div>
  );
}

