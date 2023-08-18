const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "sistemas.grupofigueiredo@gmail.com",
      pass: "xp@2018!"
    }
  });

module.exports = transport;
