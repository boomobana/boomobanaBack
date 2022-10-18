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
    return await this.sendTemplate(`کد بازیابی رمز عبور شما در ${Env.get('APP_NAME')}
    ${code}`, mobile);
  };

  async send2Auth(code, mobile) {
    return await this.sendTemplate(`رمز عبور دو مرحله ایی شما در ${Env.get('APP_NAME')}
رمز عبور : ${code}`, mobile);
  };

  async afterSignup(code, mobile) {
    return await this.sendTemplate(`به بوم و بنا خوش آمدید ${code} عزیز`, mobile);
  };

  async registerResidence(code, mobile) {
    return await this.sendTemplate(`کاربر گرامی آگهی شما در سامانه ثبت شد منتظر تایید باشید`, mobile);
  };

  async acceptResidence(code, mobile) {
    return await this.sendTemplate(`کاربر گرامی آگهی شما در سامانه ${Env.get('APP_NAME')} منتشر شد
این آگهی پس از 45 روز به طور خودکار حذف می شود.`, mobile);
  };

  async deniedResidence(code, mobile) {
    return await this.sendTemplate(`کاربرگرامی آگهی شما رد شد.
لطفا برای کسب اطلاعات بیشتر به صفحه زیر مراجعه فرمایید
https://boomobana.com/rules`, mobile);
  };

  async editResidence(code, mobile) {
    return await this.sendTemplate(`کاربر گرامی تغییرات شما بر روی آگهی اعمال شد.`, mobile);
  };

  async addMelk(code, mobile) {
    return await this.sendTemplate(`کاربر گرامی آگهی شما در سامانه ثبت شد بعد از بررسی با شما تماس گرفته می شود.`, mobile);
  };

  async activeUser(mobile) {
    return await this.sendTemplate(`کاربر گرامی پنل شما با موفقیت فعال شد`, mobile);
  };

  async buyPackage(mobile) {
    return await this.sendTemplate(`کاربر گرامی بسته شما با موفقیت فعال شد`, mobile);
  };

  async halfPackage(code, mobile) {
    return await this.sendTemplate(`کاربر گرامی شما بیش از 85 درصد از بسته خود را مصرف کرده اید و تنها 15 درصد از حجم بسته شما باقی مانده
لطفا برای اطلاع از وضعیف بسته ها به پنل خود مراجعه کنید`, mobile);
  };

  async endPackage(code, mobile) {
    return await this.sendTemplate(`کاربر گرامی شما بسته شما به اتمام رسید برای فعال سازی و اطلاع از وضعیت بسته ها به لینک زیر مراجعه بفرمایید`, mobile);
  };

  async sendTicket(mobile) {
    return await this.sendTemplate(`کاربر گرامی تیکت شما در سامانه ثبت شد`, mobile);
  };

  async sendPassword(code, mobile) {
    return await this.sendTemplate(`${Env.get('APP_NAME')}
	کد تغییر رمز عبور عبور : ${code}`, mobile);
  };

  async reciveTicket(mobile) {
    return await this.sendTemplate(`تیکت جدیدی برای شما ارسال شده لطفا بررسی کنید`, mobile);
  };

  async answerTicket(mobile) {
    return await this.sendTemplate(`کاربر گرامی پاسخ شما از سوی مدیریت ارسال شد`, mobile);
  };

  async loginSuccess(mobile) {
    return await this.sendTemplate(`به ${Env.get('APP_NAME')} خوش آمدید`, mobile);
  };

  async acceptAdvisor(code, mobile) {
    return await this.sendTemplate(`کد تایید شما برای املاک :
${code}`, mobile);
  };

  async acceptedAdvisor(code, mobile) {
    return await this.sendTemplate(`شما املاک ${code} را تایید کردید`, mobile);
  };

  async deniedAdvisor(code, mobile) {
    return await this.sendTemplate(`شما املاک ${code} را تایید کردید`, mobile);
  };

  async acceptedAdvisorTR(code, mobile) {
    return await this.sendTemplate(`مشاور ${code} املاک شمارا تایید کرد`, mobile);
  };

  async deniedAdvisorTR(code, mobile) {
    return await this.sendTemplate(`مشاور ${code} املاک شمارا رد کرد`, mobile);
  };

}

module.exports = SmsSender;
