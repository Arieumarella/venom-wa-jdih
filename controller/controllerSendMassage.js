const {valPhoneNumber} = require("../helpers/validatePhoneNumber")


exports.senMassage = async (req,res) => {
try{
    const client = await req.app.locals.client,
    nomor2 = await req.body.nomor,
    pesan = await req.body.pesan,
    validateNomor = await valPhoneNumber(nomor2);

    if(validateNomor == false){
        return res.status(401).json({
            status: false,
            message: 'validasi phone number gagal.!'
          });
    }

    if(pesan == null || pesan == ''){
        return res.status(401).json({
            status:false,
            message : 'Pesan Tidak Boleh Kosong.!'
        })
    }

    let kirim = await client.sendText(validateNomor, pesan);

    
    return res.status(200).json({
        status:true,
        message : kirim
    })


}catch(error){
    console.log(error);
    return res.status(500).json({
        status: false,
        message: await error
      });

}

}