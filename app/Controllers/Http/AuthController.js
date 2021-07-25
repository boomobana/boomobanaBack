'use strict';
const UserCode      = use('App/Models/UserCode');
const User          = use('App/Models/User');
const PasswordReset = use('App/Models/PasswordReset');
const Sms           = use('App/Controllers/Http/SmsSender');
const { validate }  = use('Validator');
const Hash          = use('Hash');

class AuthController {

  async wihMobile({ auth, request, response }) {
    const rules            = {
      mobile: 'required',
    };
    const headerRules      = {
      mobile: 'required',
    };
    const validation       = await validate(request.all(), rules);
    const headerValidation = await validate(request.all(), headerRules);
    if (validation.fails()) {
      return response.json(validation.messages());
    } else if (headerValidation.fails()) {
      return response.json(headerValidation.messages());
    }

    const { mobile } = request.all();
    let user         = new UserCode();
    user.firstname   = '';
    user.lastname    = '';
    user.mobile      = mobile;
    user.code        = Math.floor(Math.random() * (999999 - 111111) + 111111);
    user.password    = Math.floor(Math.random() * (999999 - 111111) + 111111);
    user.save();

    var sms = await new Sms().sendCodeRegister(user.code, user.mobile);

    return response.json({ status_code: 200, status_text: 'Success Login' });
  }

  async login({ auth, request, response }) {
    const rules            = {
      mobile: 'required',
      password: 'required',
    };
    const headerRules      = {
      rule: 'required',
    };
    const validation       = await validate(request.all(), rules);
    const headerValidation = await validate(request.headers(), headerRules);
    if (validation.fails()) {
      return response.json(validation.messages());
    } else if (headerValidation.fails()) {
      return response.json(headerValidation.messages());
    }
    const { mobile, password } = request.all();
    // let authUser               = await auth.attempt(mobile, password);
    let authUser               = await auth.authenticator(request.header('rule')).attempt(mobile, password);
    return response.json({ token: authUser.token, status_code: 200, status_text: 'Success Login' });
  }

  async me({ auth, params, response }) {
    try {
      if (await auth.authenticator('realEstate').check())
        response.json(auth.authenticator('realEstate').user);
    } catch (error) {
      response.send('You are not logged in');
    }
  }

  async getCode({ request, response }) {
    const rules      = {
      mobile: 'required|unique:users,mobile',
      firstname: 'required',
      lastname: 'required',
      password: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const { mobile, password, firstname, lastname } = request.all();
    let userIsExist                                 = await User.query().where('mobile', mobile).first();
    if (userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود می باشد' });
    let countUserReq = await UserCode.query().where('mobile', mobile).fetch();
    if (countUserReq.rows.length >= 10)
      return response.json({ status_code: 401, status_text: 'تعداد درخواست های شما زیاد می باشد' });
    const user     = new UserCode();
    user.firstname = firstname;
    user.lastname  = lastname;
    user.mobile    = mobile;
    user.password  = password;
    user.code      = Math.floor(Math.random() * (999999 - 111111) + 111111);
    user.used      = '1';
    var sms        = await new Sms().sendCodeRegister(user.code, user.mobile);
    user.save();

    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async FinalRegister({ request, response }) {
    const rules      = {
      mobile: 'required|unique:users,mobile',
      code: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const { code, mobile } = request.all();
    let userIsExist        = await UserCode.query().where('mobile', mobile).last();
    if (!userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });
    if (userIsExist.code !== code)
      return response.json({ status_code: 401, status_text: 'کد ارسالی اشتباه می باشد' });
    const user     = new User();
    user.firstname = userIsExist.firstname;
    user.lastname  = userIsExist.lastname;
    user.mobile    = userIsExist.mobile;
    user.password  = userIsExist.password;
    // user.password = Hash.make(request.input('password'));
    user.save();

    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async requestForgetPass({ request, response }) {
    const rules      = {
      mobile: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const { mobile } = request.all();
    let userIsExist  = await User.query().where('mobile', mobile).last();
    if (!userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });

    var pr    = new PasswordReset();
    pr.mobile = mobile;
    pr.token  = Math.floor(Math.random() * (999999 - 111111) + 111111);
    pr.save();
    await new Sms().sendCodeForgot(pr.token, pr.mobile);
    response.json({ status_code: 200, status_text: 'Successfully Done' });

  }
}

module.exports = AuthController;
