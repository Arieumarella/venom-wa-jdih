const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


exports.Login = async (req,res) => {
    try{
        
        const name = await req.body.name,
        password = await req.body.password;

        if(!name || !password){
            return res.status(401).json({
               status: false,
               message:'Invalid Paremeter.!' 
            });
        }


        const user = await prisma.user.findFirst({
            where: { name:name },
          });

          if (!user) {
            return res.status(401).json({  status: false, message: 'Invalid credentials' });
          }


          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
            return res.status(401).json({  status: false, message: 'Invalid credentials' });
          }

          const token = await jwt.sign({name : user.name, id:user.id}, process.env.SECRET_KEY, { expiresIn: '1d' });

          return res.status(200).json({
            status:true,
            token:token
          });
    
    
    }catch(error){
        console.log(error);
        return res.status(500).json({
            status: false,
            message: await error
          });
    
    }
    
    }