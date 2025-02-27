const express = require("express");
const router = express.Router();

//TEST CONTROLLER
const {
    TestController
 } = require("../controllers/test");
 



 const {
    CREATEOTP,
    VALIDATE
 } = require("../controllers/GenerateController");
 


 

//test routes link
router.route("/testapi").get(TestController);

router.route("/create").post(CREATEOTP);
router.route("/validate").post(VALIDATE);







module.exports = router;