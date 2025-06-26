const venom = require('venom-bot');
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(cors({
  origin: '*', // Sesuaikan dengan port dan domain front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

async function startAndRestoreSession() {
    try {
        const device = await prisma.Device.findFirst();
        if (!device) {
            console.log('Device tidak ditemukan di database!');
            return;
        }

        // Memulihkan sesi jika ada sesi yang tersimpan
        const clientInstance = await venom.create({
          session: device.name, 
          multidevice: false,
          headless: true,  // Ganti menjadi true untuk menggunakan headless mode
          useChrome: false, // Jika menggunakan Firefox, set ke false
          executablePath: '/usr/bin/firefox', // Ganti dengan path Firefox di Ubuntu
          browserArgs: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--start-maximized',
              '--headless', // Pastikan ini ada untuk menjalankan di mode headless
              '--disable-gpu', // Menonaktifkan GPU agar bisa berjalan di Docker
          ]
        }, (base64Qrimg, asciiQR, attempts, urlCode) => {
          console.log('Number of attempts to read the qrcode: ', attempts);
          console.log('Terminal qrcode: ', asciiQR);
          console.log('base64 image string qrcode: ', base64Qrimg);
          console.log('urlCode (data-ref): ', urlCode);
        }, async (statusSession, session) => {
          if(statusSession === 'successChat'){
              await prisma.device.deleteMany();
              await prisma.device.create({
                  data: {
                      name: device.name
                  },
              });
          }
        });

        // Mengatur client instance ke dalam variabel dan local app
        client = await clientInstance;
        app.locals.client = await clientInstance;

        console.log(`Session ${device.name} berhasil dimulai!`);
    } catch (error) {
        console.error('Gagal memulai sesi:', error);
    }
}

// Memualai Device
startAndRestoreSession();

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
});
