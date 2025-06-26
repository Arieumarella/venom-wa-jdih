const venom = require('venom-bot');
const puppeteer = require('puppeteer'); // Import puppeteer untuk mendapatkan executablePath
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

// Variabel global untuk menyimpan status sesi dan QR code
let clientInstance;
let sessionStatus = 'INITIALIZING';
let qrCodeBase64 = null;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startVenom() {
    try {
        console.log('Mencari device di database...');
        const device = await prisma.Device.findFirst();
        if (!device) {
            console.log('Device tidak ditemukan di database! Silakan buat device terlebih dahulu.');
            sessionStatus = 'NO_DEVICE_FOUND';
            return;
        }

        console.log(`Memulai sesi untuk: ${device.name}`);
        sessionStatus = 'LOADING';

        const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();
        console.log(`Using browser from: ${executablePath}`);

        clientInstance = await venom.create({
            session: device.name,
            // Hapus multidevice: false, defaultnya sudah true (Multi-Device)
            // Hapus useChrome: true, kita akan gunakan browser dari image puppeteer
            headless: true,
            puppeteer: {
                executablePath: executablePath, // <-- PENTING: Gunakan browser dari base image
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process'
                ],
            },
            catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
                console.log('QR Code diterima, simpan untuk diakses via API.');
                qrCodeBase64 = base64Qr;
                sessionStatus = 'QR_CODE_READY';
            },
            statusFind: (statusSession, session) => {
                console.log('Status Sesi: ', statusSession);
                if (statusSession === 'isLogged' || statusSession === 'successChat') {
                    sessionStatus = 'CONNECTED';
                    qrCodeBase64 = null; // Hapus QR setelah terhubung
                    // Simpan ulang device untuk menandakan koneksi berhasil
                    prisma.device.upsert({
                        where: { name: device.name },
                        update: { name: device.name },
                        create: { name: device.name }
                    }).then(() => console.log('Device status updated/confirmed in DB.'));
                } else {
                    sessionStatus = statusSession;
                }
            }
        });

        // Simpan instance client di app.locals agar bisa diakses di router
        app.locals.client = clientInstance;
        console.log(`Instance client untuk sesi ${device.name} berhasil dibuat.`);

    } catch (error) {
        console.error('Gagal memulai sesi Venom:', error);
        sessionStatus = 'ERROR';
    }
}

// Endpoint untuk memeriksa status dan mendapatkan QR code
app.get('/status', (req, res) => {
    res.json({
        status: sessionStatus,
        qrCode: qrCodeBase64
    });
});

// Jalankan Venom
startVenom();

// Router
const sendMassge = require("./router/sendMessage.js"),
    User = require("./router/createUser.js"),
    Login = require("./router/loginRouter.js"),
    deviceRouter = require("./router/deviceRouter.js");

app.use(sendMassge);
app.use(User);
app.use(Login);
app.use(deviceRouter);

// Menjalankan server Express.js
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Cek status dan QR code di endpoint: http://localhost:${port}/status`);
}); 