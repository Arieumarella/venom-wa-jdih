const express = require("express"),
router = express.Router(),
controllerSendMassage = require("../controller/controllerSendMassage");

router.route('/sendMassage')
    .post(controllerSendMassage.senMassage);

module.exports = router;