'use strict';
var request = require('request');
const Env   = use('Env');

class SmsSender {
  async sendSms(data) {
    // var url = new URL(`https://ip.sms.ir/SendMessage.ashx?user=${config.SMS_USER_NAME}&pass=${config.SMS_PASSWORD}&text=${message}&to=${mobile}&lineNo=${config.SMS_LINE_NO}`);
    var url = `https://api.kavenegar.com/v1/${Env.get('SMS_KEY')}/sms/send.json`;
    return request.post({
      url: url,
      form: { ...data },
    }, function (err, httpResponse, body) {
      // console.log(body.body);
      return body.body;
    });
  };

  sendTemplate(message, mobile) {
    var data = {
      receptor: mobile,
      sender: Env.get('SMS_LINE_SEND'),
      message: message,
    };
    return this.sendSms(data);
  };

  sendCodeRegister(code, mobile) {
    return this.sendTemplate(`${Env.get('APP_NAME')}
	کد ثبت نام شما : ${code}`, mobile);
  };

  sendCodeForgot(code, mobile) {
    return this.sendTemplate(`${Env.get('APP_NAME')}
	کد فراموشی رمز عبور شما : ${code}`, mobile);
  };

}

module.exports = SmsSender;
