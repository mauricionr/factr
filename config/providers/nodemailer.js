const Nodemailer = require('nodemailer');

module.exports = {
  mailer: Nodemailer,
  sendmail(sender, receiver, nome, subject, text){
    // create reusable transporter object using the default SMTP transport
    let transporter = this.mailer.createTransport({
      host: 'smtp.lenord.com.br',
      auth: {
        user: 'mail@lenord.com.br',
        pass: 'lenord@2017'
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"FactrApp Contato: '+ nome +'" <' + sender + '>', // sender address
      to: 'haluanedecassia@gmail.com', //receiver, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: '<p>'+ text +'</p>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
    });
  }
}
// teste abaixo browser-refresh nodemailer.js
//
// let transporter = Nodemailer.createTransport({
//   host: 'smtp.lenord.com.br',
//   auth: {
//     user: 'mail@lenord.com.br',
//     pass: 'lenord@2017'
//   }
// });
//
// // setup email data with unicode symbols
// let mailOptions = {
//   from: '"FactrApp Contato: Halú de Cássia" <haluanedecassia@hotmail.com>', // sender
//   to: 'haluanedecassia@gmail.com', // list of receivers
//   subject: 'Hello ✔', // Subject line
//   text: 'Hello world ?', // plain text body
//   html: '<b>Hello world ?</b>' // html body
// };
//
// // send mail with defined transport object
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Message %s sent: %s', info.messageId, info.response);
// });
