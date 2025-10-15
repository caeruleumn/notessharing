# Notes App (Go + Next.js + Postgres)

Aplikasi catatan sederhana yang memanfaatkan teknologi modern seperti Go untuk backend, Next.js untuk frontend, dan Postgres sebagai database. Fitur yang tersedia meliputi autentikasi, pembuatan, pengeditan, dan penghapusan catatan.

---

## Struktur Proyek
- `backend/` — API menggunakan Go
- `frontend/` — Aplikasi Next.js dengan TailwindCSS
- `db/` — Inisialisasi schema SQL (`init.sql`)
- `docker-compose.yml` — Mengelola layanan (database, backend, frontend)

---

## Panduan Setup Lokal (Tanpa Docker)

### 1) Menjalankan Database Postgres
Anda dapat menggunakan Postgres lokal atau menjalankannya melalui Docker.

Contoh menjalankan Postgres dengan Docker:
```bash
# Membuat container Postgres

docker run --name notes-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=notesdb -p 5432:5432 -v notes_db_data:/var/lib/postgresql/data -d postgres:15
```

Import schema:
- Jalankan perintah SQL di `db/init.sql` ke database `notesdb`.

### 2) Backend (Go)
- Masuk ke folder `backend/`
- Buat file `.env` atau gunakan konfigurasi berikut:
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/notesdb?sslmode=disable
JWT_SECRET=supersecret
```
- Install dependensi dan jalankan server:
```bash
# dari folder backend
go mod tidy
go run .
```
Server backend akan berjalan di `http://localhost:8080`.

### 3) Frontend (Next.js)
- Masuk ke folder `frontend/`
- Buat file `.env.local` dengan isi berikut:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080

# (Opsional) Konfigurasi Cloudinary untuk upload media
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```
- Install dependensi dan jalankan server frontend:
```bash
# dari folder frontend
npm install
npm run dev
```
Server frontend akan berjalan di `http://localhost:3000`.

---

## Menjalankan dengan Docker Compose

Untuk menjalankan semua layanan sekaligus (database, backend, frontend):
```bash
# dari root project
docker compose up --build
```
- Postgres: `localhost:5432`
- Backend (Go): `http://localhost:8080`
- Frontend (Next.js): `http://localhost:3000`

Untuk menghentikan layanan:
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
# Konfigurasi opsional untuk Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

---

## Screenshot Aplikasi

- Halaman Login

  ![Login](frontend/public/file.svg)

- Daftar Catatan

  ![Notes](frontend/public/globe.svg)

- Detail Catatan

  ![Modal](frontend/public/next.svg)

---

## Contoh Log

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
- Jika Tailwind memberikan peringatan atau error terkait `@apply` atau `@tailwind`, pastikan plugin Tailwind di editor aktif. Build tetap aman.
- Jika terjadi 401 atau redirect ke halaman login saat membuka `/notes`, periksa token yang tersimpan dan pastikan `NEXT_PUBLIC_API_URL` mengarah ke backend yang benar.
- Jika upload media melalui Cloudinary tidak berhasil, pastikan variabel `NEXT_PUBLIC_CLOUDINARY_*` sudah diisi dengan benar dan preset upload diaktifkan.

---

## Lisensi
Proyek ini bebas digunakan sesuai kebutuhan.

