const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const venom = require('venom-bot');
const puppeteer = require('puppeteer');

exports.create = async (req,res) => {
try{
    const deviceName = await req.body.deviceName;

    if(!deviceName){
        return res.status(401).json({
            status: false,
            message: 'Invalid Parameter.!'
          });
    }

    let client = await req.app.locals.client;

    if(client != null){
        console.log('masuk hapus session');
        await client.logout();
        await client.close();
        req.app.locals.client = await null;
    }

    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath();

    const clientInstance = await venom.create({
        session: deviceName, 
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
    },(base64Qrimg) => {
       
        //Mengirim response api qr code 
        if(base64Qrimg){
        
            res.status(200).json({
                status: true,
                message: 'QR code generated',
                qrCode: base64Qrimg
            });
        
        }else{
            // Mengirim respon gagal memuat qr code
            res.status(500).json({
                status: false,
                message: 'Gagal Mememuat QR Qode'
            });  
        
        }

      }, async (statusSession, session) => {
        //Proses jika qr berhasil di update maka update data 
        if(statusSession === 'successChat'){
          console.log('masuuuk update data' + deviceName);
          await prisma.device.deleteMany();
          await prisma.device.create({
            data: {
              name: deviceName
            },
          });

        }
      });



    req.app.locals.client = await clientInstance;

    
}catch(err){
    console.log(err);
    return res.status(500).json({
        status: false,
        message: await err
      });
}

}


exports.chackStatusConetion = async (req,res) => {

    try {

      let client = await req.app.locals.client,
      status = await client.isConnected();

      return res.status(200).json({
        status:true,
        data: 'ini status conction device ' + status 
      })
        
    } catch (err) {

    console.log(err);
    prisma.device.deleteMany();
    return res.status(500).json({
                status: false,
                message: await err
            });

    }
}


exports.deleteClien = async (req,res) => {

  try {

    let client = await req.app.locals.client;
    console.log(client);
    await client.logout();
    await client.close();
    req.app.locals.client = null;

    await prisma.device.deleteMany();


    return res.status(200).json({
      status:true,
      message:'device berhasil dihapus.!'
    })
      
  } catch (err) {

  console.log(err);
  return res.status(500).json({
              status: false,
              message: await err
          });

  }
}


exports.consoleClient = async (req,res) => {

  try {

    let client = await req.app.locals.client;
    console.log('Ini Client ------------>'+client);

    return res.status(200).json({
      status:true,
      data : client
    })
      
  } catch (err) {

  console.log(err);
  return res.status(500).json({
              status: false,
              message: await err
          });

  }
}
