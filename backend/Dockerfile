# Stage 1 - Build binary Go
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Copy go mod dan download dependency lebih dulu (biar cache aman)
COPY go.mod go.sum ./
RUN go mod download

# Copy semua file backend
COPY . .

# Build binary
RUN go build -o server .

# Stage 2 - Run minimal image
FROM alpine:latest

WORKDIR /app

# Copy hasil build dari stage 1
COPY --from=builder /app/server .

# Buat folder uploads (untuk gambar nanti)
RUN mkdir -p /app/uploads

EXPOSE 8080

# Jalankan backend
CMD ["./server"]
