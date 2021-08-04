'use strict';

const UserCode      = use('App/Models/UserCode');
const User          = use('App/Models/User');
const PasswordReset = use('App/Models/PasswordReset');
const Sms           = use('App/Controllers/Http/SmsSender');
const { validate }  = use('Validator');
const Hash          = use('Hash');

class UserController {
  async findUser({ auth, request, response }) {
    return response.json(await User.query().where('slug', request.body.slug).with('residence').last());
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

  async changeAvatar({ auth, request, response }) {
    const {
            avatar,
          } = request.all();

    let userIsExist = await User.query().where('mobile', auth.user.mobile).last();
    if (!userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });
    console.log(userIsExist);
    userIsExist.avatar = avatar;
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
