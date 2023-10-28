const bodyParser = require('body-parser');
const express = require("express");
const path = require("path");

require("../src/db/conn");
const Candidate = require("../src/models/candidates");
const Register = require("../src/models/registers");
const voteButtons = document.getElementsByClassName('updatevote-btn');
try{
    Array.from(voteButtons).forEach(button => {
        button.addEventListener('click', function() {
            alert("clicked")
        });
    });

}
catch(error){
    alert(error);
}