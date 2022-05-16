'use strict';
const UserCode      = use('App/Models/UserCode'),
      User          = use('App/Models/User'),
      RealEstate    = use('App/Models/RealEstate'),
      LoginActivity = use('App/Models/LoginActivity'),
      PasswordReset = use('App/Models/PasswordReset'),
      Sms           = use('App/Controllers/Http/SmsSender'),
      Mail          = use('App/Controllers/Http/MailSender'),
      { validate }  = use('Validator'),
      Hash          = use('Hash'),
      geoip         = require('geoip-lite'),
      ip            = require('ip');

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
          await LoginActivity.create({
            user_id: realEstate.id,
            ip: 'ip',
            os: 'ip',
            lat: 'ip',
            lng: 'ip',
          });

          let logins = await auth.generate(realEstate);
          await new Sms().loginSuccess(mobile);
          return response.json({ status_code: 200, rule: rule, status_text: 'Success Login', token: logins.token });
        } else {
          return response.json({ status_code: 202, rule: rule, status_text: 'User Is Not Exist' });
        }
      } else if (rule === 'user') {
        let user = await User.query().where('mobile', mobile).first();
        if (!!user && !!user.id) {
          await LoginActivity.create({
            user_id: user.id,
            ip: 'ip',
            os: 'ip',
            lat: 'ip',
            lng: 'ip',
          });
          let logins = await auth.generate(user);
          await new Sms().loginSuccess(mobile);
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
    const { rule }             = request.headers();
    // let authUser               = await auth.attempt(mobile, password);
    let userA                  = User.query().where('mobile', mobile);
    if (rule === 'realEstate') {
      let userEx = await userA.where('is_realestate', 1).last();
      if (!userEx) {
        return response.status(403).json({ status_code: 403, status_text: 'User Permission Denied' });
      }
    } else if (rule === 'admin') {
      let userEx = await userA.where('is_admin', 1).last();
      if (!userEx) {
        return response.status(403).json({ status_code: 403, status_text: 'User Permission Denied' });
      }
    } else if (rule === 'user') {
      let userEx = await userA.where('is_user', 1).last();
      if (!userEx) {
        return response.status(403).json({ status_code: 403, status_text: 'User Permission Denied' });
      }
    } else if (rule === 'advisor') {
      let userEx = await userA.where('is_advisor', 1).last();
      if (!userEx) {
        return response.status(403).json({ status_code: 403, status_text: 'User Permission Denied' });
      }
    }
    let userOs = (await request.header('user-agent')).split('(')[1].split(' ')[0];
    var geo    = await geoip.lookup(ip);
    console.log(await request.ip(), geo);
    await LoginActivity.create({
      user_id: (await userA.last()).id, ip: request.ip(), os: userOs.toLowerCase(),//request.os(),
      lat: 'ip', lng: 'ip',
    });
    let authUser = await auth.attempt(mobile, password);
    await new Sms().loginSuccess(mobile);
    // await new Mail().send2Step('Salam',auth.user.email);
    return response.json({ token: authUser.token, status_code: 200, status_text: 'Success Login' });
  }

  async me({ auth, request, response }) {
    try {
      let userOs = (await request.header('user-agent')).split('(')[1].split(' ')[0];
      let ipA    = await request.ip();
      var geo    = geoip.lookup(ipA);
      console.log(geo.ll, geo.country, geo.city, ipA, userOs);
      const headerRules      = {
        rule: 'required',
      };
      const headerValidation = await validate(request.headers(), headerRules);
      if (headerValidation.fails()) {
        return response.json(headerValidation.messages());
      }
      if (await auth.check())
        response.json(auth.user);
    } catch (error) {
      response.send('You are not logged in');
    }
  }

  async getCode({ request, response }) {
    const rules      = {
      mobile: 'required',
      firstname: 'required',
      lastname: 'required',
      password: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const rulesHeader      = {
      rule: 'required',
    };
    const validationHeader = await validate(request.headers(), rulesHeader);
    if (validationHeader.fails()) {
      return response.json(validationHeader.messages());
    }

    const {
            mobile,
            password,
            firstname,
            lastname,
          } = request.all();
    const {
            rule,
          } = request.headers();
    if (rule === 'realEstate') {
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
    } else if (rule === 'user') {
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
    }
    let countUserReq = await UserCode.query().where('mobile', mobile).fetch();
    if (countUserReq.rows.length >= 10)
      return response.json({ status_code: 401, status_text: 'تعداد درخواست های شما زیاد می باشد' });
    const user     = new UserCode();
    user.firstname = firstname;
    user.lastname  = lastname;
    user.mobile    = mobile;
    user.password  = password;
    user.rule      = rule;
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
      userStart            = new User();
      userStart.firstname  = firstname;
      userStart.lastname   = lastname;
      userStart.mobile     = mobile;
      userStart.password   = password;
      userStart.pageSignup = 1;
      userStart.is_user    = 1;
      await userStart.save();
    } else if (rule === 'realEstate') {
      const mobileRule       = {
        mobile: 'unique:users,mobile',
      };
      const mobileValidation = await validate(request.all(), mobileRule);
      if (mobileValidation.fails()) {
        return response.json(mobileValidation.messages());
      }
      userStart               = new RealEstate();
      userStart.firstname     = firstname;
      userStart.lastname      = lastname;
      userStart.mobile        = mobile;
      userStart.pageSignup    = 1;
      userStart.is_realestate = 1;
      userStart.password      = password;
      await userStart.save();
    } else {
      return response.json({ status_code: 404, status_text: 'not found' });
    }
    let us = await User.query().where('id', userStart.id).last();
    await LoginActivity.create({
      user_id: us.id,
      ip: 'ip',
      os: 'ip',
      lat: 'ip',
      lng: 'ip',
    });
    let logins = await auth.attempt(mobile, password);
    response.json({ status_code: 200, status_text: 'Successfully Done', token: logins.token });
  }

  async FinallRegisterrrr({ auth, request, response }) {
    const rulesHeader      = {
      rule: 'required',
    };
    const validationHeader = await validate(request.headers(), rulesHeader);
    const mobileRule       = {
      mobile: 'required',
      tell: 'required',
      economic_code: 'required',
      postal_code: 'required',
      business_license: 'required',
      business_license_number: 'required',
      statute: 'required',
    };
    const mobileValidation = await validate(request.all(), mobileRule);
    if (mobileValidation.fails()) {
      return response.json(mobileValidation.messages());
    } else if (validationHeader.fails()) {
      return response.json(validationHeader.messages());
    }
    const {
            rule,
          } = request.headers();
    var userStart;

    const {
            mobile,

          } = request.all();
    if (rule === 'realEstate') {
      const realEstateRule       = {
        name: 'required',
        name_en: 'required',
        sos: 'required',
        logo: 'required',
        email: 'required',
        site_url: 'required',
        social_url: 'required',
        tell: 'required',
        economic_code: 'required',
        postal_code: 'required',
        business_license: 'required',
        business_license_number: 'required',
        statute: 'required',
        address: 'required',
        about_azhans: 'required',
        lat: 'required',
        lng: 'required', type: 'required',
        card_number: 'required',
        shaba_number: 'required',
        account_owner_name: 'required',
        shomare_hesab: 'required',
        bank_name: 'required',
      };
      const realEstateValidation = await validate(request.all(), realEstateRule);
      if (realEstateValidation.fails()) {
        return response.json(realEstateValidation.messages());
      }
      const {
              type,
              card_number,
              shaba_number,
              shomare_hesab,
              account_owner_name,
              bank_name,
              name,
              name_en,
              sos,
              logo,
              email,
              site_url,
              social_url,
              tell,
              economic_code,
              postal_code,
              business_license,
              business_license_number,
              statute,
              address,
              about_azhans,
              lat,
              lng,
            }                           = request.all();
      userStart                         = await RealEstate.query().where('mobile', mobile).last();
      userStart.card_number             = card_number;
      userStart.shaba_number            = shaba_number;
      userStart.shomare_hesab           = shomare_hesab;
      userStart.account_owner_name      = account_owner_name;
      userStart.bank_name               = bank_name;
      userStart.name                    = name;
      userStart.name_en                 = name_en;
      userStart.sos                     = sos;
      userStart.logo                    = logo;
      userStart.email                   = email;
      userStart.site_url                = site_url;
      userStart.social_url              = social_url;
      userStart.address                 = address;
      userStart.tell                    = tell;
      userStart.economic_code           = economic_code;
      userStart.postal_code             = postal_code;
      userStart.business_license        = business_license;
      userStart.business_license_number = business_license_number;
      userStart.statute                 = statute;
      userStart.address                 = address;
      userStart.bio                     = about_azhans;
      userStart.lat                     = lat;
      userStart.lng                     = lng;
    } else if (rule === 'user') {
      const userDefRule       = {
        type: 'required',
        card_number: 'required',
        shomare_hesab: 'required',
        shaba_number: 'required',
        account_owner_name: 'required',
        bank_name: 'required',
      };
      const userDefValidation = await validate(request.all(), userDefRule);
      if (userDefValidation.fails()) {
        return response.json(userDefValidation.messages());
      }
      const {
              type,
              card_number,
              shomare_hesab,
              shaba_number,
              account_owner_name,
              bank_name,
            }                      = request.all();
      userStart                    = await User.query().where('mobile', mobile).last();
      userStart.type               = type;
      userStart.card_number        = card_number;
      userStart.shaba_number       = shaba_number;
      userStart.shomare_hesab      = shomare_hesab;
      userStart.account_owner_name = account_owner_name;
      userStart.bank_name          = bank_name;
      if (type == 2) {
        const userType2Rule       = {
          tell: 'required',
          economic_code: 'required',
          postal_code: 'required',
          business_license: 'required',
          business_license_number: 'required',
          statute: 'required',
          address: 'required',
        };
        const userType2Validation = await validate(request.all(), userType2Rule);
        if (userType2Validation.fails()) {
          return response.json(userType2Validation.messages());
        }
        const {
                tell,
                economic_code,
                postal_code,
                business_license,
                business_license_number,
                statute,
                address,
              }                           = request.all();
        userStart.tell                    = tell;
        userStart.economic_code           = economic_code;
        userStart.postal_code             = postal_code;
        userStart.business_license        = business_license;
        userStart.business_license_number = business_license_number;
        userStart.statute                 = statute;
        userStart.address                 = address;
      }
    }

    userStart.pageSignup = 3;
    await userStart.save();
    let us;
    if (rule === 'realEstate') {
      us = await RealEstate.query().where('mobile', mobile).last();
    } else if (rule === 'user') {
      us = await User.query().where('mobile', mobile).last();
    }
    await LoginActivity.create({
      user_id: us.id,
      ip: 'ip',
      os: 'ip',
      lat: 'ip',
      lng: 'ip',
    });

    let logins = await auth.generate(us);
    response.json({ status_code: 200, status_text: 'Successfully Done', token: logins.token });
  }

  async SendModirDet({ auth, request, response }) {
    const rules            = {
      mobile: 'required',
      firstname: 'required',
      lastname: 'required',
      national_id: 'required',
      male: 'required',
      avatar: 'required',
      birthday: 'required',
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
            rule,
          } = request.headers();
    var userStart;
    const {
            mobile,
            firstname,
            lastname,
            national_id,
            male,
            avatar,
            birthday,
          } = request.all();

    if (rule === 'realEstate') {
      const rules2      = {
        firstname_en: 'required',
        lastname_en: 'required',
        kartMeli: 'required',
        javazKasb: 'required',
        account_owner_name: 'required',
        fathername: 'required',
        bank_name: 'required',
        shomare_hesab: 'required',
        shaba_number: 'required',
        card_number: 'required',
        about: 'required',
      };
      const validation2 = await validate(request.all(), rules2);
      if (validation2.fails()) {
        return response.json(validation.messages());
      }
      const {
              firstname_en,
              lastname_en,
              javazKasb,
              account_owner_name,
              fathername,
              bank_name,
              shomare_hesab,
              shaba_number,
              card_number,
              kartMeli,
              about,
            }                = request.all();
      userStart              = await RealEstate.query().where('mobile', mobile).last();
      userStart.firstname_en = firstname_en;
      userStart.lastname_en  = lastname_en;
      userStart.kartMeli     = kartMeli;
      userStart.about        = about;

      userStart.javazKasb          = javazKasb;
      userStart.account_owner_name = account_owner_name;
      userStart.fathername         = fathername;
      userStart.bank_name          = bank_name;
      userStart.shaba_number       = shomare_hesab;
      userStart.shaba_number       = shaba_number;
      userStart.card_number        = card_number;
    } else if (rule === 'user') {
      const rules2      = {
        kart_meli: 'required',
        address: 'required',
      };
      const validation2 = await validate(request.all(), rules2);
      if (validation2.fails()) {
        return response.json(validation.messages());
      }
      const {
              kart_meli,
              address,
            }             = request.all();
      userStart           = await User.query().where('mobile', mobile).last();
      userStart.kart_meli = kart_meli;
      userStart.address   = address;
    }
    userStart.firstname   = firstname;
    userStart.lastname    = lastname;
    userStart.national_id = national_id;
    userStart.male        = male;
    userStart.mobile      = mobile;
    userStart.avatar      = avatar;
    userStart.birthday    = birthday;
    userStart.pageSignup  = 2;

    await userStart.save();
    let us;
    if (rule === 'realEstate') {
      us = await RealEstate.query().where('id', userStart.id).last();
    } else if (rule === 'user') {
      us = await User.query().where('mobile', mobile).last();
    }
    await LoginActivity.create({
      user_id: us.id,
      ip: 'ip',
      os: 'ip',
      lat: 'ip',
      lng: 'ip',
    });

    let logins = await auth.generate(us);
    response.json({ status_code: 200, status_text: 'Successfully Done', token: logins.token });
  }

  async FinalRegister({ request, response }) {
    const rules      = {
      mobile: 'required',
      code: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const { code, mobile }  = request.all();
    const rulesHeaders      = {
      rule: 'required',
    };
    const validationHeaders = await validate(request.headers(), rulesHeaders);
    if (validationHeaders.fails()) {
      return response.json(validationHeaders.messages());
    }

    const {
            rule,
          }         = request.headers();
    let userIsExist = await UserCode.query().where('mobile', mobile).last();
    if (userIsExist.code !== code)
      return response.json({ status_code: 401, status_text: 'کد ارسالی اشتباه می باشد' });
    if (rule === 'user') {
      const rules      = {
        mobile: 'required|unique:users,mobile',
        code: 'required',
      };
      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return response.json(validation.messages());
      }

      const user     = new User();
      user.firstname = userIsExist.firstname;
      user.lastname  = userIsExist.lastname;
      user.mobile    = userIsExist.mobile;
      user.password  = userIsExist.password;
      // user.password = Hash.make(request.input('password'));
      user.save();
    } else if (rule === 'realEstate') {
      const rules      = {
        mobile: 'required|unique:users,mobile',
        code: 'required',
      };
      const validation = await validate(request.all(), rules);
      if (validation.fails()) {
        return response.json(validation.messages());
      }

      const user     = new RealEstate();
      user.firstname = userIsExist.firstname;
      user.lastname  = userIsExist.lastname;
      user.mobile    = userIsExist.mobile;
      user.password  = userIsExist.password;
      // user.password = Hash.make(request.input('password'));
      user.save();
    }
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
