'use strict';
const nodemailer = require('nodemailer'),
      Env        = use('Env'),
      moment     = require('moment-jalaali');

class MailSender {
  async sendMail(to, title, body, htmlbody) {
    return new Promise(async (callback, reject) => {
      let transporter = nodemailer.createTransport({
        host: Env.get('SMTP_HOST'),
        port: Env.get('SMTP_PORT'),
        secure: Env.get('SMTP_SECURE'), // true for 465, false for other ports
        auth: {
          user: Env.get('SMTP_USERNAME'), // generated ethereal user
          pass: Env.get('SMTP_PASSWORD'), // generated ethereal password
        },
      });
      let info        = await transporter.sendMail({
        from: '"Boom O Bana" <info@boomobana.com>', // sender address
        to: to, // list of receivers
        subject: title, // Subject line
        text: body, // plain text body
        html: htmlbody, // html body
      });
      return callback({ info });
    });
  };

  async send2Step(code, to) {
    return new Promise(async (callback, reject) => {
      let title    = `کد ورود دو مرحله ایی به سامانه بوم و بنا`,
          body     = `کد شما برای ورود ${code} می باشد`,
          htmlBody = `<p>کد شما برای ورود ${code} می باشد</p>`;
      return callback(await this.sendMail(to, title, body, htmlBody));
    });
  }
}

module.exports = MailSender;
