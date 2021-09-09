'use strict';
var request = require('request');
const Env   = use('Env');
var moment  = require('moment-jalaali');

class SmsSender {
  async sendSms(data) {
    return new Promise((callback, reject) => {
      // var url = new URL(`https://ip.sms.ir/SendMessage.ashx?user=${config.SMS_USER_NAME}&pass=${config.SMS_PASSWORD}&text=${message}&to=${mobile}&lineNo=${config.SMS_LINE_NO}`);
      var url = `https://api.kavenegar.com/v1/${Env.get('SMS_KEY')}/sms/send.json`;
      request.post({
        url: url,
        form: { ...data },
      }, function (err, httpResponse, body) {
        // console.log(body.body);
        if (err) reject(err);
        return callback(body);
      });
    });
  };

  async sendTemplate(message, mobile) {
    var data = {
      receptor: mobile,
      sender: Env.get('SMS_LINE_SEND'),
      message: message,
    };
    return await this.sendSms(data);
  };

  async sendCodeRegister(code, mobile) {
    return await this.sendTemplate(`${Env.get('APP_NAME')}
	کد ورود شما : ${code}`, mobile);
  };

  async sendCodeForgot(code, mobile) {
    return await this.sendTemplate(`${Env.get('APP_NAME')}
	کد فراموشی رمز عبور شما : ${code}`, mobile);
  };

  async sendPassword(code, mobile) {
    return await this.sendTemplate(`${Env.get('APP_NAME')}
	رمز عبور جدید شما : ${code}`, mobile);
  };

  async loginSuccess(mobile) {
    let date = new Date();
    let hm   = date.getHours() + ':' + date.getMinutes();
    return await this.sendTemplate(`${Env.get('APP_NAME')}
ورود موفق به پنل
${moment().format('jYYYY/jM/jD')} ${hm}`, mobile);
  };

}

module.exports = SmsSender;
