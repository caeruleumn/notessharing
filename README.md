# Notes App (Go + Next.js + Postgres)

## Versi Santai (Buat Anak SMK)

Mau catatan digital kayak aplikasi beneran? Ini project-nya. Backend pakai Go, frontend pakai Next.js + Tailwind, database-nya Postgres.

- **Fitur utama**: Login/Register (JWT), bikin catatan, edit, hapus, liat detail di modal. UI warna biru soft biar adem.

### Cara Cepat Jalanin (Paling Gampang: Docker)
1. Pastikan sudah install Docker.
2. Dari folder project, jalankan:
   ```bash
   docker compose up --build
   ```
3. Buka `http://localhost:3000` (frontend). Backend ada di `http://localhost:8080`. Postgres jalan di `5432`.
4. Beres! Coba register → auto login → bikin catatan.

### Cara Jalanin Lokal (Tanpa Docker)
- Jalankan Postgres (bebas, lokal atau docker).
- Backend (Go):
  ```bash
  # di folder backend
  # .env contoh
  DATABASE_URL=postgres://postgres:postgres@localhost:5432/notesdb?sslmode=disable
  JWT_SECRET=supersecret

  go mod tidy
  go run .
  # jalan di http://localhost:8080
  ```
- Frontend (Next.js):
  ```bash
  # di folder frontend
  # .env.local contoh
  NEXT_PUBLIC_API_URL=http://localhost:8080
  # opsional (kalau mau upload gambar via Cloudinary)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

  npm install
  npm run dev
  # jalan di http://localhost:3000
  ```

### Screenshot (Taruh Gambar Kamu Sendiri)
- Simpan gambar di `frontend/public/`, lalu bisa tampil di README.
  - Login → `frontend/public/login-screenshot.png`
  - Daftar Notes → `frontend/public/notes-list-screenshot.png`
  - Modal Detail → `frontend/public/note-modal-screenshot.png`

### Kalau Ada Error Umum
- Tailwind warning aneh? Biasanya karena plugin editor, build tetep aman.
- Ke-redirect ke login terus? Cek token di localStorage/cookie dan `NEXT_PUBLIC_API_URL` bener.
- Upload Cloudinary gagal? Cek dua env: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` dan `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

---

# Notes App (Go + Next.js + Postgres)

Aplikasi catatan sederhana dengan backend Go, frontend Next.js (Tailwind), dan database Postgres. Mendukung autentikasi JWT, CRUD catatan, serta UI biru soft.

---

## Struktur Proyek
- `backend/` — API Go
- `frontend/` — Next.js app (TailwindCSS)
- `db/` — inisialisasi schema SQL (`init.sql`)
- `docker-compose.yml` — orkestrasi layanan (db, backend, frontend)

---

## Prasyarat
- Node.js 18+ dan npm / pnpm / yarn (untuk pengembangan frontend lokal)
- Go 1.22+ (untuk pengembangan backend lokal)
- Docker & Docker Compose (untuk menjalankan seluruh stack via kontainer)

---

## Setup Lokal (tanpa Docker)

### 1) Jalankan Database Postgres
Anda bisa menggunakan Postgres lokal atau Docker terpisah.

Contoh (Docker satuan):
```bash
# Membuat Postgres cepat (opsional)
docker run --name notes-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=notesdb -p 5432:5432 -v notes_db_data:/var/lib/postgresql/data -d postgres:15
```

Import schema:
- Jalankan perintah SQL di `db/init.sql` ke database `notesdb` Anda.

### 2) Backend (Go)
- Masuk ke direktori `backend/`
- Buat file `.env` atau gunakan variabel lingkungan berikut:
```bash
# .env backend (contoh)
DATABASE_URL=postgres://postgres:postgres@localhost:5432/notesdb?sslmode=disable
JWT_SECRET=supersecret
```
- Install dependensi dan jalankan:
```bash
# dari folder backend
go mod tidy
go run .
# backend akan berjalan di http://localhost:8080
```

### 3) Frontend (Next.js)
- Masuk ke direktori `frontend/`
- Buat file `.env.local` seperti berikut:
```bash
# .env.local frontend (contoh untuk pengembangan lokal)
NEXT_PUBLIC_API_URL=http://localhost:8080

# (Opsional) Integrasi Cloudinary untuk unggah media via frontend
# Gunakan jika Anda ingin memanfaatkan upload langsung dari UI
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```
- Install dan jalankan dev server:
```bash
# dari folder frontend
npm install
npm run dev
# frontend akan berjalan di http://localhost:3000
```

---

## Menjalankan dengan Docker Compose (Direkomendasikan)

Semua layanan (db, backend, frontend) bisa dijalankan sekaligus:
```bash
# dari root project
docker compose up --build
```
- Postgres: `localhost:5432`
- Backend (Go): `http://localhost:8080`
- Frontend (Next.js): `http://localhost:3000`

Catatan:
- `frontend` di dalam Docker akan menggunakan `NEXT_PUBLIC_API_URL=http://backend:8080` (sudah diset pada `docker-compose.yml`).
- Jika ingin override env frontend lain, set di `frontend/.env.production` lalu rebuild.

Hentikan layanan:
```bash
docker compose down
```

---

## Contoh File .env

### `backend/.env`
```env
DATABASE_URL=postgres://postgres:postgres@db:5432/notesdb?sslmode=disable
JWT_SECRET=supersecret
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
# opsional untuk unggah media via Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

> Di lingkungan Docker, `NEXT_PUBLIC_API_URL` sudah diarahkan ke `http://backend:8080` via `docker-compose.yml`.

---

## Cara Pakai (Alur Singkat)
- Akses `http://localhost:3000`
- Register → Auto-login → Masuk ke halaman Notes
- Tambah, Edit, Hapus catatan
- Logout membersihkan token dari localStorage dan cookie

---

## Screenshot Aplikasi
Letakkan screenshot Anda di `frontend/public/` atau folder lain dan referensikan di sini.

Contoh (silakan ganti dengan path file Anda):

- Login
  
  ![Login](frontend/public/login-screenshot.png)

- Notes (Daftar)
  
  ![Notes](frontend/public/notes-list-screenshot.png)

- Modal Detail Catatan
  
  ![Modal](frontend/public/note-modal-screenshot.png)

---

## (Opsional) Contoh Log

### Backend (Go)
```text
2025/10/15 12:00:00 Server listening on :8080
2025/10/15 12:00:05 POST /login 200 OK user=alice
2025/10/15 12:00:07 GET /notes 200 OK user=alice
2025/10/15 12:00:12 POST /notes 201 Created user=alice title="Belanja"
```

### Frontend (Browser Console)
```text
🚀 Fetching notes...
✅ Data diterima: [ { id: 1, title: "Belanja", ... } ]
```

---

## Troubleshooting
- Jika Tailwind warning/error di editor tentang `@apply` atau `@tailwind`, pastikan Tailwind/VSCode plugin aktif; build sebenarnya aman.
- Jika 401/redirect ke login saat membuka `/notes`, periksa token tersimpan dan `NEXT_PUBLIC_API_URL` mengarah ke backend yang benar.
- Jika unggah media via Cloudinary tidak muncul, pastikan `NEXT_PUBLIC_CLOUDINARY_*` terisi dan preset upload diaktifkan (unsigned).

---

## Lisensi
Gunakan sesuai kebutuhan Anda.

