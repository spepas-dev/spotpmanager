
const asynHandler = require("../middleware/async");
const UtilityHelper = require("../helper/utilfunc");
const { REGISTRATION_STATUS, RESPONSE_CODES } = require("../helper/vars");




exports.CREATEOTP = asynHandler(async (req, res, next) => {

  
    let otpObj  = req.body;
 
    let otpRaw = UtilityHelper.generateOTP(6);

    let otpHarsh = UtilityHelper.sha256Encrypt(otpRaw);



    const expDate = new Date();

    const expDateUpdated = new Date(expDate);

    if(otpObj.counterType == "SECOND"){
        expDateUpdated.setSeconds(expDateUpdated.getSeconds() + otpObj.expiryCounter);
    }else if(otpObj.counterType == "MINUTE"){
        expDateUpdated.setMinutes(expDateUpdated.getMinutes() + otpObj.expiryCounter);
    }else{
        expDateUpdated.setHours(expDateUpdated.getHours() + otpObj.expiryCounter);
    }

  
  otpEncrypted = "";
  //UtilityHelper.AESEncryptMain(otpRaw,process.env.AES_KEY,process.env.AES_IV);

 

  var otpRequestObj =  {
    expiryDate: expDateUpdated,
    otpHarshed: otpHarsh,
    otpEncrypted: otpEncrypted,
    sendSms: otpObj.sendSms,
    phoneNumber: UtilityHelper.formatPhone(otpObj.phoneNumber),
    sendEmail: otpObj.sendEmail,
    emailMessage: otpObj.emailMessage,
    smsMessage: otpObj.smsMessage,
    expiryCounter: otpObj.expiryCounter,
    counterType: otpObj.counterType,
    User_ID: otpObj.User_ID,
    email: otpObj.email
  }
  
  var otpUrl = process.env.DB_BASE_URL +"otp/create"; 
  

  let newJob = await UtilityHelper.makeHttpRequest("POST",otpUrl,otpRequestObj);



 
  if(!newJob)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to services",
            data : continents
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }


    if(newJob.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
     }


     ///TODO Generate sms notification
     //TODO Send sms to user through notification services
     ///TODO If sent email is 1 Generate email and send through notification services

 

 
 
    return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
 
 })
 








exports.VALIDATE = asynHandler(async (req, res, next) => {

  
    let {otp, otpID}  = req.body;
 
   

    let otpHarsh = UtilityHelper.sha256Encrypt(otp);

    


  var otpRequestObj =  {
    otpHarshed: otpHarsh,
    otpID: otpID
  }
  
  var otpUrl = process.env.DB_BASE_URL +"otp/details"; 
  

  let newJob = await UtilityHelper.makeHttpRequest("POST",otpUrl,otpRequestObj);



 
  if(!newJob)
    {
        var resp = {
            status : RESPONSE_CODES.FAILED,
            message : "Failed to connect to services",
            data : continents
        };
        return UtilityHelper.sendResponse(res, 200, resp.message, resp);
    }
 

    if(newJob.status != RESPONSE_CODES.SUCCESS){
        return UtilityHelper.sendResponse(res, 200, newJob.message, newJob);
     }


     var resp = {
        status : RESPONSE_CODES.SUCCESS,
        message : "Success",
        data : newJob.data
    };
 
    return UtilityHelper.sendResponse(res, 200, resp.message, resp);
 
 })
 