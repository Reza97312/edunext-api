const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  console.log(`Mock Email Sent to ${to}: [${subject}] ${text}`);
  return true;
};

module.exports = sendEmail;
