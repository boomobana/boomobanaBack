'use strict';
const UserCode      = use('App/Models/UserCode'),
      User          = use('App/Models/User'),
      RealEstate    = use('App/Models/RealEstate'),
      PasswordReset = use('App/Models/PasswordReset'),
      Sms           = use('App/Controllers/Http/SmsSender'),
      { validate }  = use('Validator'),
      Hash          = use('Hash');

class AuthController {
  async wihMobile({ auth, request, response }) {
    const rules            = {
      mobile: 'required',
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

    const { mobile } = request.all();
    let user         = new UserCode();
    user.firstname   = '';
    user.lastname    = '';
    user.mobile      = mobile;
    user.password    = Math.floor(Math.random() * (999999 - 111111) + 111111);
    user.code        = Math.floor(Math.random() * (999999 - 111111) + 111111);
    user.rule        = request.header('rule');
    user.save();

    var sms = await new Sms().sendCodeRegister(user.code, user.mobile);
    console.log(sms);
    return response.json({ status_code: 200, status_text: 'Success Login' });
  }

  async wihMobileCode({ auth, request, response }) {
    const rules            = {
      mobile: 'required',
      code: 'required',
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

    const {
            mobile,
            code,
          }      = request.all();
    const {
            rule,
          }      = request.headers();
    let userCode = await UserCode.query().orderBy('id', 'desc').where('rule', rule).where('mobile', mobile).first();
    if (!!userCode && userCode.code === code) {
      if (rule === 'realEstate') {
        let realEstate = await RealEstate.query().where('mobile', mobile).first();
        if (!!realEstate && !!realEstate.id) {
          let logins = await auth.authenticator(rule).generate(realEstate);
          return response.json({ status_code: 200, rule: rule, status_text: 'Success Login', token: logins.token });
        } else {
          return response.json({ status_code: 202, rule: rule, status_text: 'User Is Not Exist' });
        }
      } else if (rule === 'user') {
        let user = await User.query().where('mobile', mobile).first();
        if (!!user && !!user.id) {
          let logins = await auth.authenticator(rule).generate(user);
          return response.json({ status_code: 200, rule: rule, status_text: 'Success Login', token: logins.token });
        } else {
          return response.json({ status_code: 202, rule: rule, status_text: 'User Is Not Exist' });
        }
      }
    } else {
      return response.json({ status_code: 403, status_text: 'Code Dosnt true' });
    }
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
    console.log(request.header('rule'));
    // let authUser               = await auth.attempt(mobile, password);
    let authUser = await auth.authenticator(request.header('rule')).attempt(mobile, password);
    return response.json({ token: authUser.token, status_code: 200, status_text: 'Success Login' });
  }

  async me({ auth, request, response }) {
    try {
      const headerRules      = {
        rule: 'required',
      };
      const headerValidation = await validate(request.headers(), headerRules);
      if (headerValidation.fails()) {
        return response.json(headerValidation.messages());
      }
      if (await auth.authenticator(request.header('rule')).check())
        response.json(auth.authenticator(request.header('rule')).user);
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

  async FinalRegisterCode({ auth, request, response }) {
    const rules            = {
      mobile: 'required',
      code: 'required',
      password: 'required',
      firstname: 'required',
      lastname: 'required',
    };
    const validation       = await validate(request.all(), rules);
    const rulesHeader      = {
      rule: 'required',
    };
    const validationHeader = await validate(request.headers(), rulesHeader);

    if (validation.fails()) {
      return response.json(validation.messages());
    } else if (validationHeader.fails()) {
      return response.json(validationHeader.messages());
    }
    const {
            code,
            mobile,
            firstname,
            lastname,
            password,
          }         = request.all();
    const {
            rule,
          }         = request.headers();
    let userIsExist = await UserCode.query().where('rule', rule).where('mobile', mobile).last();
    var userStart;
    if (!userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });
    if (userIsExist.code !== code)
      return response.json({ status_code: 401, status_text: 'کد ارسالی اشتباه می باشد' });
    if (rule === 'user') {
      const mobileRule       = {
        mobile: 'unique:users,mobile',
      };
      const mobileValidation = await validate(request.all(), mobileRule);
      if (mobileValidation.fails()) {
        return response.json(mobileValidation.messages());
      }
      userStart           = new User();
      userStart.firstname = firstname;
      userStart.lastname  = lastname;
      userStart.mobile    = mobile;
      userStart.password  = password;
      await userStart.save();
    } else if (rule === 'realEstate') {
      const mobileRule       = {
        firstname_en: 'required',
        lastname_en: 'required',
        mobile: 'unique:real_estates,mobile',
        tell: 'required',
        sos: 'required',
        email: 'required',
        economic_code: 'required',
        registration_number: 'required',
        business_license: 'required',
        business_license_number: 'required',
        statute: 'required',
        address: 'required',
      };
      const mobileValidation = await validate(request.all(), mobileRule);
      if (mobileValidation.fails()) {
        return response.json(mobileValidation.messages());
      }
      const {
              firstname_en,
              lastname_en,
              tell,
              sos,
              email,
              economic_code,
              registration_number,
              business_license,
              business_license_number,
              statute,
              address,
            }                           = request.all();
      userStart                         = new RealEstate();
      userStart.firstname               = firstname;
      userStart.lastname                = lastname;
      userStart.firstname_en            = firstname_en;
      userStart.lastname_en             = lastname_en;
      userStart.mobile                  = mobile;
      userStart.tell                    = tell;
      userStart.sos                     = sos;
      userStart.email                   = email;
      userStart.economic_code           = economic_code;
      userStart.registration_number     = registration_number;
      userStart.business_license        = business_license;
      userStart.business_license_number = business_license_number;
      userStart.statute                 = statute;
      userStart.address                 = address;
      userStart.password                = password;
      await userStart.save();
    } else {
      return response.json({ status_code: 404, status_text: 'not found' });
    }
    let us;
    if (rule === 'user')
      us = await User.query().where('id', userStart.id).last();
    else if (rule === 'realEstate')
      us = await RealEstate.query().where('id', userStart.id).last();

    console.log(userStart);
    let logins = await auth.authenticator(rule).generate(us);
    response.json({ status_code: 200, status_text: 'Successfully Done', token: logins.token });
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
}

module.exports = AuthController;
