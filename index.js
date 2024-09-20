const venom = require('venom-bot');
const express = require('express');
const cron = require('node-cron');
const app = express();
const port = 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

let client;


// Fungsi untuk memulai Venom Bot
function start(clientInstance) {
    client = clientInstance;
    app.locals.client = clientInstance;
    client.onMessage((message) => {
        if (message.body === 'Hi' && message.isGroupMsg === false) {
            client.sendText(message.from, 'Balasan Dari Bot WA Biro Hukum.!');
        }

        if (message.body === 'test' || message.body === 'tes') {
            client.sendText(message.from, 'Test Bali.!');
        }
    });
}

// Memulihkan sesi jika ada sesi yang tersimpan
venom.create({
        session: 'session-name', // Nama sesi
        multidevice: true, // Dukungan multi perangkat
    })
    .then((clientInstance) => start(clientInstance))
    .catch((error) => console.log(error));


// Router
const sendMassge = require("./router/sendMessage.js");

app.use(sendMassge);

// Rute dasar untuk menguji server Express.js
app.get('/', (req, res) => {
    res.send('Hello from Venom Bot with Express.js!');
});

// Rute untuk mengirim pesan
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    try {
        await client.sendText(`${number}@c.us`, message);
        res.send('Message sent!');
    } catch (error) {
        res.status(500).send('Failed to send message');
    }
});

// cron.schedule('0 0 30 3,6,9,12 *', () => {
//     taskFunction();
//   });

// Menjalankan server Express.js
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
