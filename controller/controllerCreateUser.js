
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.create = async (req,res) => {
try{
    
let name = await req.body.name,
email = await req.body.email,
password = await req.body.password;

if(!name || !email || !password){
    return res.status(401).json({
        status: false,
        message: 'Invalid Parameter.!'
      });
}

let hashedPassword = await bcrypt.hash(password, 10);

const newUser = await prisma.user.create({
    data: {
        name,
        email,
        password: hashedPassword,
    },
});


return res.status(200).json({
    status: true,
    message: 'User Berhasil Dibuat'
  });


}catch(error){
    console.log(error);
    return res.status(500).json({
        status: false,
        message: await error
      });

}

}