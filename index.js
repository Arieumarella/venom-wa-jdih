const venom = require('venom-bot');
const express = require('express');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

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
            headless: false,          // Set ke false untuk menampilkan browser
            useChrome: true,           // Set true jika ingin menggunakan Google Chrome
            executablePath: 'C:/Program Files/Mozilla Firefox/firefox.exe', // Ganti dengan lokasi Firefox di sistem kamu
            browserArgs: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--start-maximized'
              ]           
        },(base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('Number of attempts to read the qrcode: ', attempts);
            console.log('Terminal qrcode: ', asciiQR);
            console.log('base64 image string qrcode: ', base64Qrimg);
            console.log('urlCode (data-ref): ', urlCode);
        
        }, async (statusSession, session) => {
            //Proses jika qr berhasil di update maka update data 
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
