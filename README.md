# WhatsApp API dengan Node.js, Express, dan Venom WA

Repository ini menyediakan API untuk otomatisasi WhatsApp yang dibangun dengan **Node.js**, **Express.js**, dan library **Venom WA**. API ini dirancang untuk membantu pengelolaan sesi WhatsApp secara efisien serta menyediakan berbagai endpoint untuk mengirim pesan, mengelola kontak, dan fitur lainnya.

---

## ✨ **Fitur Utama**:

- **Integrasi Venom WA**: Mendukung otomatisasi WhatsApp Web secara penuh.
- **Backend yang Ringan**: Dibangun dengan **Node.js** dan **Express.js**.
- **RESTful API**: Desain endpoint yang mudah diakses dan terstruktur.
- **Manajemen Sesi Cerdas**: Mendukung pemulihan sesi untuk penggunaan jangka panjang.
- **Konfigurasi Mudah**: Dikustomisasi sesuai kebutuhan melalui file `.env`.

---

## ⚙️ **Cara Instalasi**:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/Arieumarella/venom-wa-jdih.git
   cd venom-wa-jdih

2. **Edit File `.env`**:
   - Sesuaikan variabel berikut di file `.env`:
     ```env
     DATABASE_URL=<URL_DATABASE_ANDA>
     SECRET_KEY=<SECRET_KEY_ANDA>
     ```

3. **Instal Dependensi**:
   ```bash
   npm install

4. **Jalankan Migrasi Prisma**:
   - Untuk membuat tabel database sesuai dengan schema Prisma:
     ```bash
     npx prisma migrate dev
     ```

5. **Jalankan Server**:
   ```bash
   npm run dev

  ## Cara Penggunaan (lanjutan):
6. **Buat Pengguna Baru**  
   Gunakan endpoint berikut untuk membuat akun baru:  
   - **Endpoint:** `POST http://localhost:3000/createUser`  
   - **Parameter (Body):**
     ```json
     {
       "name": "Nama Anda",
       "email": "email@example.com",
       "password": "password123"
     }
     ```
   - **Respons Sukses:**
     ```json
     {
       "message": "User created successfully",
       "user": {
         "id": "user_id",
         "name": "Nama Anda",
         "email": "email@example.com"
       }
     }
     ```

7. **Login untuk Mendapatkan Bearer Token**  
   Gunakan endpoint ini untuk login dan mendapatkan token otorisasi:  
   - **Endpoint:** `POST http://localhost:3000/Login`  
   - **Parameter (Body):**
     ```json
     {
       "email": "email@example.com",
       "password": "password123"
     }
     ```
   - **Respons Sukses:**
     ```json
     {
       "message": "Login successful",
       "token": "your_bearer_token_here"
     }
     ```
   Simpan token ini untuk digunakan di header permintaan API lainnya.

8. **Jelajahi Endpoint Lainnya**  
   Semua endpoint API tersedia di file `WA_collection.json`. Anda dapat mengimpornya ke aplikasi Postman atau alat serupa untuk mempermudah pengujian.  
   - Contoh penggunaan token:
     Tambahkan token ke header permintaan sebagai berikut:
     ```text
     Authorization: Bearer your_bearer_token_here
     ```

## Tips Penggunaan:
- Pastikan file `.env` sudah diatur dengan benar untuk menghindari error konfigurasi.
- Jika sesi WhatsApp terputus, library Venom WA akan mencoba menyambung ulang secara otomatis.
- Periksa log server untuk debugging jika ada masalah dalam pengiriman pesan atau koneksi.

Selamat mencoba, dan jangan ragu untuk membuka issue jika Anda membutuhkan bantuan lebih lanjut!

