# --- Tahap 1: Builder ---
# Di tahap ini, kita install semua dependensi (termasuk dev) untuk build
FROM ghcr.io/puppeteer/puppeteer:latest AS builder

WORKDIR /app

# Gunakan user non-root untuk keamanan
USER pptruser

# Salin file package untuk instalasi dependensi
COPY --chown=pptruser:pptruser package*.json ./

# Install SEMUA dependensi, termasuk devDependencies (untuk prisma CLI)
RUN npm install

# Salin sisa kode, termasuk skema prisma
COPY --chown=pptruser:pptruser . .

# Jalankan prisma generate menggunakan CLI yang sudah terinstall dari devDependencies
RUN npx prisma generate


# --- Tahap 2: Final Image ---
# Di tahap ini, kita buat image produksi yang bersih dan ramping
FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

# Gunakan user non-root yang sama
USER pptruser

# Salin file package lagi untuk instalasi dependensi produksi
COPY --chown=pptruser:pptruser package*.json ./

# Install HANYA dependensi produksi untuk menjaga ukuran image tetap kecil
RUN npm install --omit=dev

# Salin hasil build dari tahap "builder"
# Ini termasuk kode aplikasi dan folder .prisma/client yang sudah di-generate
COPY --chown=pptruser:pptruser --from=builder /app .

# Ekspos port aplikasi
EXPOSE 3000

# Perintah untuk menjalankan aplikasi
# Nama file utama Anda adalah index.js, jadi ini sudah benar.
CMD [ "node", "index.js" ]