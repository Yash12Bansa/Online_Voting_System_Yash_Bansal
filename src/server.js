// server.js
const bodyParser = require('body-parser');
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const twilio = require('twilio');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
require("./db/conn")
const Register = require("./models/registers");
const Candidate = require("./models/candidates");

const port = process.env.PORT || 8000;

const static_path =path.join(__dirname , "../public");

app.use(express.static(static_path));

const tamplate_path = path.join(__dirname , "../tamplates/views");
const partials_path = path.join(__dirname , "../tamplates/partials");
app.set("view engine" , "hbs");
app.set("views" , tamplate_path );
app.use(express.urlencoded({extended:false}));

hbs.registerPartials(partials_path);
app.get("/" , (req, res)=>{
    res.render("index" );
});
app.get("/index" , (req, res)=>{
  res.render("index" );
});
app.get("/about" , (req, res)=>{
  res.render("about" );
});
app.get("/contact" , (req, res)=>{
  res.render("contact");
})
app.get("/register" , (req, res)=>{
  res.render("register");
})
app.get("/login" , (req, res)=>{
  res.render("login");
})


// Create a Twilio client with your account SID and auth token
const client = twilio(
  'AC6f7f8b9548d28d51efca106dc60162e9',
  '20fef3c8f10a8b3ab0af131cc28feabd'
);
var otp = '';
// Generate a random OTP verification code
function generateOTP() {
  var digits = '0123456789';
  var otpLength = 6; // Length of the OTP code

  otp = '';
  for (var i = 0; i < otpLength; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
}

// Function to render the OTP via SMS
function renderOTPviaSMS(phoneNumber, otp) {
  // Replace 'YOUR_TWILIO_PHONE_NUMBER' with your Twilio phone number
  const twilioPhoneNumber = +15737703379;

  // render the SMS using Twilio
  client.messages
    .create({
      body: 'Your OTP verification code: ' + otp,
      from: twilioPhoneNumber,
      to: phoneNumber
    })
    .then(message => console.log(otp))
    .catch(error => console.error('Error rendering OTP:', error));
}
var name;
var contact;
var aadhar;
var password;
var status;

app.post("/register" , (req, res)=>{
  name = req.body.name;
  contact = req.body.contact;
   aadhar = req.body.aadhar;
  password = req.body.password;
  status = req.body.status;
  
  
  console.log(name , contact , aadhar , password , status);
  renderOTPviaSMS(contact, generateOTP())
  
  res.render("otp");
})
app.post("/verify" , async(req , res)=>{
  if(req.body.otp == otp){
    try{
      const registerEmployee = new Register({
       name:name,
       contact:contact,
       aadhar:aadhar,
       status:status,
       password:password,
       vstatus:0

      })
      const result = await registerEmployee.save();
      res.status(201).render("index");
   }
   catch(error){
      res.render(error);
   }
  }
  else{
    res.render("otp not matched");
  }
})
app.post("/login" , async(req, res)=>{
  try{
  const contact = "91" + req.body.contact;
  const password = req.body.password;
  const user = await Register.findOne({contact:contact, password:password});
  
  
  if(user){
    if(user.status=='voter'){
      var cand = await Candidate.find()
      .then((candidates)=>{
        res.render("dashboard" , {candidates , user})
      })

    }
    else if(user.status=='admin'){
             res.render("admindash" , {name:user.name , contact:user.contact});
    }
  }
  else{
      alert("invalid username or password");
  }
}
  catch(error){
      res.status(400).render("error404");
  }
})


app.get("/voterlist" , (req, res)=>{
  
    Register.find({status:'voter'})
      .then((registers) => {
        res.render('voterlist', {registers });
      })
      .catch((err) => {
        console.error('Failed to fetch records:', err);
        res.render('voterlist', { registers: [] });
      });
  
  
});

app.get("/candidatelist" , (req, res)=>{
  Candidate.find()
  .then((candidates) => {
    candidates = candidates.map((candidate) => ({
      ...candidate._doc,
      logo: candidate.logo.toString('base64'),
    }));
    console.log(candidates); // Add
    res.render('candidatelist', { candidates });
  })
  .catch((err) => {
    console.error('Failed to fetch records:', err);
    res.render('candidatelist', { candidates: [] });
  });
  
})
app.get("/newcandidate" , (req , res)=>{
  res.render("newcandidate");
})
app.post("/newcandidate" , async(req , res)=>{
  
    try{
      const registerCandidate = new Candidate({
       image: {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: "image/png",
      },
      name: req.body.name,
      contact: req.body.contact,
      aadhar: req.body.aadhar,
      totalvote: 0,
       

      })
      const result = await registerCandidate.save();
      res.status(201).render("admindash");
   }
   catch(error){
      res.render(error);
   }
  
  
})
app.post("/updateVote", (req, res) => {
  // Extract data from the request body
  const { username, usercontact, candidatename} = req.body;

  // Perform the necessary database operations or any other server-side actions
  // Update vote status for the user
  
  // Assuming you have a Register model defined

Register.updateOne(
  { name: username, contact: usercontact },
  { $set: { vstatus: 1 } }
)
  .exec() // Use exec() to return a promise
  .then(() => {
    // Handle success
    console.log('Vote status updated successfully');
    return Candidate.updateOne(
      { name: candidatename },
      { $inc: { totalvote: 1 } } // Use $inc to increment the totalvote field
    ).exec(); // Use exec() to return a promise
  })
  .then(() => {
    // Handle success
    console.log('Candidate vote count updated successfully');
    res.render('Success');
    
  })
  .catch((error) => {
    // Handle error
    console.error('Error updating vote status:', error);
    res.status(500).render('Error');
  });

});

app.listen(port , ()=>{
  console.log(`server is running on port no ${port}`)
});



