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
}

// Memulihkan sesi jika ada sesi yang tersimpan
venom.create({
        session: 'session-name', // Nama sesi
        multidevice: true, // Dukungan multi perangkat
    })
    .then((clientInstance) => start(clientInstance))
    .catch((error) => console.log(error));


// Router
const sendMassge = require("./router/sendMessage.js"),
User = require("./router/createUser.js"),
Login = require("./router/loginRouter.js");

app.use(sendMassge);
app.use(User);
app.use(Login);

// Menjalankan server Express.js
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
