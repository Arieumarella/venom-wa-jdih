const express = require("express"),
router = express.Router(),
controllerSendMassage = require("../controller/controllerSendMassage"),
auth = require("../middleware/auth"); 

router.route('/sendMassage')
    .post(auth, controllerSendMassage.senMassage);

module.exports = router;