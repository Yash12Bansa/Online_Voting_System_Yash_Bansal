// Require the Twilio module
const twilio = require('twilio');

// Create a Twilio client with your account SID and auth token
const client = twilio(
  'ACeebd8e139d742e64ac42c6858cf7d085',
  '282824e436755b04e40fe3eec0e40e66'
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

// Function to send the OTP via SMS
function sendOTPviaSMS(phoneNumber, otp) {
  // Replace 'YOUR_TWILIO_PHONE_NUMBER' with your Twilio phone number
  const twilioPhoneNumber = +13157045690;

  // Send the SMS using Twilio
  client.messages
    .create({
      body: 'Your OTP verification code: ' + otp,
      from: twilioPhoneNumber,
      to: phoneNumber
    })
    .then(message => console.log(otp))
    .catch(error => console.error('Error sending OTP:', error));
}

// Example usage
// var phoneNumber = '+919927910186'; // Replace with the recipient's phone number
// var verificationCode = generateOTP();

// var otp = sendOTPviaSMS(phoneNumber, generateOTP());
