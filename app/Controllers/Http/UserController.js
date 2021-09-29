'use strict';

const Adviser            = use('App/Models/Adviser');
const Transaction        = use('App/Models/Transaction');
const RealEstateCustomer = use('App/Models/RealEstateCustomer');
const Ticket             = use('App/Models/Ticket');
const RealEstateEvent    = use('App/Models/RealEstateEvent');
const Residence          = use('App/Models/Residence');
const UserCode           = use('App/Models/UserCode');
const FavoriteAd         = use('App/Models/FavoriteAd');
const User               = use('App/Models/User');
const RealEstate         = use('App/Models/RealEstate');
const PasswordReset      = use('App/Models/PasswordReset');
const Sms                = use('App/Controllers/Http/SmsSender');
const { validate }       = use('Validator');
const Hash               = use('Hash');

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
          }        = request.all();
    const { rule } = request.headers();
    let userIsExist;
    if (rule === 'user') {
      userIsExist = await User.query().where('mobile', auth.user.mobile).last();
    } else if (rule === 'realEstate') {
      userIsExist = await RealEstate.query().where('mobile', auth.user.mobile).last();
    }
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

  // async changePassword({ auth, request, response }) {
  //   const rules      = {
  //     password: 'required',
  //   };
  //   const validation = await validate(request.all(), rules);
  //   if (validation.fails()) {
  //     return response.json(validation.messages());
  //   }
  //   const {
  //           password,
  //         } = request.all();
  //
  //   let userIsExist = await User.query().where('mobile', auth.user.mobile).last();
  //   if (!userIsExist)
  //     return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });
  //
  //   // userIsExist.password = await Hash.make(password);
  //   userIsExist.password = password;
  //   userIsExist.save();
  //   response.json({ status_code: 200, status_text: 'Successfully Done' });
  // }

  async ChangePassword({ auth, request, response }) {
    const { rule }  = request.headers();
    let userIsExist = await RealEstate.query().where('mobile', auth.authenticator(rule).user.mobile).last();
    if (!userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });

    // userIsExist.password = await Hash.make(password);
    let passsword        = String(Math.floor(Math.random() * (999999 - 111111) + 111111));
    userIsExist.password = passsword;
    userIsExist.save();
    var sms = await new Sms().sendPassword(passsword, userIsExist.mobile);
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async homeFetch({ auth, request, response }) {
    const { rule }          = request.headers();
    const { id }            = auth.authenticator(rule).user;
    const files             = await Residence.query().where('user_id', id).count('*');
    const filesCount        = files[0][Object.keys(files[0])];
    const advisor           = await Adviser.query().where('id', id).count('*');
    const advisorCount      = advisor[0][Object.keys(advisor[0])];
    const event             = await RealEstateEvent.query().where('real_estate_id', id).count('*');
    const eventCount        = event[0][Object.keys(event[0])];
    const TicketF           = await Ticket.query().where('user_id', id).count('*');
    const TicketFCount      = TicketF[0][Object.keys(TicketF[0])];
    const CustomerF         = await RealEstateCustomer.query().where('real_estate_id', id).count('*');
    const CustomerFCount    = CustomerF[0][Object.keys(CustomerF[0])];
    const Transaction2      = await Transaction.query().where('status', 2).where('user_id', id).count('*');
    const Transaction2Count = Transaction2[0][Object.keys(Transaction2[0])];
    const Favorite2         = await FavoriteAd.query().where('user_id', id).count('*');
    const Favorite2Count    = Favorite2[0][Object.keys(Favorite2[0])];
    const json              = {
      filesCount,
      advisorCount,
      eventCount,
      TicketFCount,
      CustomerFCount,
      Transaction2Count,
      Favorite2Count,
    };
    return response.json(json);
  }

  async homeFetchCountingAdmin({ auth, request, response }) {
    const files             = await Residence.query().count('*');
    const filesCount        = files[0][Object.keys(files[0])];
    const advisor           = await Adviser.query().count('*');
    const advisorCount      = advisor[0][Object.keys(advisor[0])];
    const event             = await RealEstateEvent.query().count('*');
    const eventCount        = event[0][Object.keys(event[0])];
    const TicketF           = await Ticket.query().count('*');
    const TicketFCount      = TicketF[0][Object.keys(TicketF[0])];
    const CustomerF         = await RealEstateCustomer.query().count('*');
    const CustomerFCount    = CustomerF[0][Object.keys(CustomerF[0])];
    const Transaction2      = await Transaction.query().count('*');
    const Transaction2Count = Transaction2[0][Object.keys(Transaction2[0])];
    const Favorite2         = await FavoriteAd.query().count('*');
    const Favorite2Count    = Favorite2[0][Object.keys(Favorite2[0])];
    const RealEstateC       = await RealEstate.query().count('*');
    const RealEstateCount   = RealEstateC[0][Object.keys(RealEstateC[0])];
    const json              = {
      filesCount,
      advisorCount,
      eventCount,
      TicketFCount,
      CustomerFCount,
      Transaction2Count,
      Favorite2Count,
      RealEstateCount,
    };
    return response.json(json);
  }

  async userFetchAdmin({ auth, request, response }) {
    return response.json(await User.query().paginate());
  }
}

module.exports = UserController;
