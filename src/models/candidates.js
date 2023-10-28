const mongoose = require('mongoose');
const candidateSchema = new mongoose.Schema({
   logo:{
  type:Buffer, 
  required:true
   },
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
   totalvote:{
     type:Number,
    
   }
  
   

})
const Candidate = new mongoose.model("Candidate" , candidateSchema);
module.exports = Candidate;
