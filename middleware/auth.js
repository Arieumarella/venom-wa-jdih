const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {

  const token = req.header('Authorization')?.split(' ')[1]; 

  // Cek apakah token ada
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verifikasi token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded.user; 
    next(); // Lanjut ke middleware berikutnya atau rute yang diminta
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;