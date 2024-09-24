const express = require("express"),
router = express.Router(),
controllerCreateUser = require("../controller/controllerCreateUser");

router.route('/createUser')
    .post(controllerCreateUser.create);

module.exports = router;