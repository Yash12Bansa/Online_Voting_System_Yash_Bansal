const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
   name:{
    type : String , 
    required: true
   },
   contact:{
        type:Number,
        required:true,
        
   },
   aadhar:{
        type:Number,
        required:true, 
        
   },
   status:{
    type:String,
    required:true
   },
   password:{
    type:String, 
    required:true
   },
   vstatus:{
     type:Number,
     
   }
   

})
const Register = new mongoose.model("Register" , employeeSchema);
module.exports = Register;
