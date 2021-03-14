'use strict';

const UserCode      = use('App/Models/UserCode');
const User          = use('App/Models/User');
const PasswordReset = use('App/Models/PasswordReset');
const Sms           = use('App/Controllers/Http/SmsSender');
const { validate }  = use('Validator');
const Hash          = use('Hash');

class UserController {
  async login({ auth, request, response }) {
    const rules      = {
      mobile: 'required',
      password: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const { mobile, password } = request.all();
    let authUser               = await auth.attempt(mobile, password);
    return response.json({ token: authUser.token, status_code: 200, status_text: 'Success Login' });
  }

  async me({ auth, params, response }) {
    try {
      if (await auth.check())
        response.json(auth.user);
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

  async FinallRegister({ request, response }) {
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

  async changeForgotPassword({ request, response }) {
    const rules      = {
      mobile: 'required',
      code: 'required',
      password: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const { mobile, code, password } = request.all();

    let userIsExist = await User.query().where('mobile', mobile).last();
    if (!userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });

    let reqResetIsExist = await PasswordReset.query().where('mobile', mobile).last();
    if (!reqResetIsExist)
      return response.json({ status_code: 401, status_text: 'درخواست ارسال کنید' });
    if (reqResetIsExist.token != code)
      return response.json({ status_code: 401, status_text: 'کد ارسالی صحیح نیست' });

    // userIsExist.password = await Hash.make(password);
    userIsExist.password = password;
    userIsExist.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async changeProfile({ auth, request, response }) {
    const {
            lastname,
            firstname,
            birthday,
            male,
            national_id,
            avatar,
            email,
            region,
            city,
          } = request.all();

    let userIsExist = await User.query().where('mobile', auth.user.mobile).last();
    if (!userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });

    // userIsExist.password = await Hash.make(password);
    if (request.hasBody('lastname'))
      userIsExist.lastname = lastname;
    if (request.hasBody('firstname'))
      userIsExist.firstname = firstname;
    if (request.hasBody('birthday'))
      userIsExist.birthday = birthday;
    if (request.hasBody('male'))
      userIsExist.male = male;
    if (request.hasBody('national_id'))
      userIsExist.national_id = national_id;
    if (request.hasBody('avatar'))
      userIsExist.avatar = avatar;
    if (request.hasBody('email')) {
      const rules      = {
        mobile: 'required',
        code: 'required',
        password: 'required',
      };
      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return response.json(validation.messages());
      }
      userIsExist.email = email;
    }
    if (request.hasBody('region'))
      userIsExist.region = region;
    if (request.hasBody('city'))
      userIsExist.city = city;
    userIsExist.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async changePassword({ auth, request, response }) {
    const rules      = {
      password: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const {
            password,
          } = request.all();

    let userIsExist = await User.query().where('mobile', auth.user.mobile).last();
    if (!userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });

    // userIsExist.password = await Hash.make(password);
    userIsExist.password = password;
    userIsExist.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = UserController;
