const express = require("express"),
router = express.Router(),
controllerLogin = require("../controller/controllerLogin");

router.route('/Login')
    .post(controllerLogin.Login);

module.exports = router;