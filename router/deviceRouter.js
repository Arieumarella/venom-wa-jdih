const express = require("express"),
router = express.Router(),
controllerDevice = require("../controller/controllerDevice"),
auth = require("../middleware/auth"); 

router.route('/device').post(auth, controllerDevice.create);
router.route('/ChackStatus').get(auth, controllerDevice.chackStatusConetion);
router.route('/DeleteClient').get(auth, controllerDevice.deleteClien);
router.route('/cek').get(auth, controllerDevice.consoleClient);

module.exports = router;