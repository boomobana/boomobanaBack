'use strict';

const Adviser            = use('App/Models/Adviser');
const Transaction        = use('App/Models/Transaction');
const RealEstateCustomer = use('App/Models/RealEstateCustomer');
const Creator            = use('App/Models/Creator');
const Ticket             = use('App/Models/Ticket');
const TicketPm           = use('App/Models/TicketPm');
const RealEstateEvent    = use('App/Models/RealEstateEvent');
const Residence          = use('App/Models/Residence');
const UserCode           = use('App/Models/UserCode');
const FavoriteAd         = use('App/Models/FavoriteAd');
const User               = use('App/Models/User');
const ResidenceComment   = use('App/Models/ResidenceComment');
const Reserved           = use('App/Models/Reserved');
const StaticPages        = use('App/Models/StaticPages');
const SiteModalPages     = use('App/Models/SiteModalPages');
const Region             = use('App/Models/Region');
const Province           = use('App/Models/Province');
const LoginActivity      = use('App/Models/LoginActivity');
const RealEstate         = use('App/Models/RealEstate');
const PasswordReset      = use('App/Models/PasswordReset');
const Database           = use('Database');
const Sms                = use('App/Controllers/Http/SmsSender');
const { validate }       = use('Validator');
const Hash               = use('Hash');

class UserController {
  async findUser({ auth, request, response }) {
    return response.json(await User.query().where('id', request.body.slug).with('residence', q => {
      q.where('archive', 0).where('status', 2);
    }).last());
  }

  async changeProfile({ auth, request, response }) {
    const {
            lastname, firstname, birthday, male, national_id, avatar, email, region, city,
          }        = request.all();
    const { rule } = request.headers();
    let userIsExist;
    if (rule === 'user') {
      userIsExist = await User.query().where('mobile', auth.user.mobile).last();
    } else if (rule === 'realEstate') {
      userIsExist = await RealEstate.query().where('mobile', auth.user.mobile).last();
    }
    if (!userIsExist) return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });

    // userIsExist.password = await Hash.make(password);
    if (request.hasBody('lastname')) userIsExist.lastname = lastname;
    if (request.hasBody('firstname')) userIsExist.firstname = firstname;
    if (request.hasBody('birthday')) userIsExist.birthday = birthday;
    if (request.hasBody('male')) userIsExist.male = male;
    if (request.hasBody('national_id')) userIsExist.national_id = national_id;
    if (request.hasBody('avatar')) userIsExist.avatar = avatar;
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
    if (request.hasBody('region')) userIsExist.region = region;
    if (request.hasBody('city')) userIsExist.city = city;
    userIsExist.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async changeAvatar({ auth, request, response }) {
    const {
            avatar,
          } = request.all();

    let userIsExist = await User.query().where('mobile', auth.user.mobile).last();
    if (!userIsExist) return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });
    // // console.log(userIsExist);
    userIsExist.avatar = avatar;
    userIsExist.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async fetchPostssearch({ auth, request, response }) {
    const {
            text,
          } = request.all();
    if (text == '' || text == null) {
      let province2 = await Province.query().fetch();
      return response.json({ type: 'region', 'region': [], 'province': province2 });
    }
    let region2   = await Region.query().where('title', 'like', '%' + text + '%').fetch();
    let province2 = await Province.query().where('title', 'like', '%' + text + '%').fetch();
    if (region2.rows.length > 0) {
      return response.json({ type: 'region', 'region': region2, 'province': province2 });
    } else if (province2.rows.length > 0) {
      return response.json({ type: 'region', 'region': region2, 'province': province2 });
    } else {
      let residence2 = await Residence.query().where('title', 'like', '%' + text + '%').orWhere('description', 'like', '%' + text + '%').orWhere('real_address', 'like', '%' + text + '%').fetch();
      return response.json({ type: 'all', 'residence': residence2.rows });
    }
    return response.json({ status_code: 200 });
  }

  async changePassword({ auth, request, response }) {
    const rules      = {
      password: 'required',
      token: 'required|min:6|max:6',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const {
            password,
            token,
          } = request.all();

    let userIsExist = await User.query().where('mobile', auth.user.mobile).last();
    if (!userIsExist)
      return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });
    let passwordResetFild = await PasswordReset.query().where('mobile', auth.user.mobile).last();
    if (!passwordResetFild)
      return response.json({ status_code: 401, status_text: 'درخواستی برای شما یافت نشد' });
    if (passwordResetFild.token !== token)
      return response.json({ status_code: 401, status_text: 'کد ارسالی اشتباه است' });
    if (passwordResetFild.used === 1)
      return response.json({ status_code: 401, status_text: 'این کد قبلا استفاده شده است' });
    // userIsExist.password = await Hash.make(password);
    userIsExist.password = password;
    userIsExist.save();
    passwordResetFild.used = 1;
    passwordResetFild.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async changePasswordBefore({ auth, request, response }) {
    const { rule }  = request.headers();
    let userIsExist = await RealEstate.query().where('mobile', auth.user.mobile).last();
    if (!userIsExist) return response.json({ status_code: 401, status_text: 'کاربر موجود نمی باشد' });
    let passwordReset    = new PasswordReset();
    // userIsExist.password = await Hash.make(password);
    let passsword        = String(Math.floor(Math.random() * (999999 - 111111) + 111111));
    passwordReset.token  = passsword;
    passwordReset.mobile = auth.user.mobile;
    passwordReset.save();
    var sms = await new Sms().sendPassword(passsword, userIsExist.mobile);
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async homeFetch({ auth, request, response }) {
    const { rule }          = request.headers();
    const { id }            = auth.user;
    const files             = await Residence.query().where('rule', rule).where('user_id', id).count('*');
    const filesCount        = files[0][Object.keys(files[0])];
    const filesSell         = await Residence.query().where('rule', rule).where('type', 3).where('user_id', id).count('*');
    const filesSellCount    = filesSell[0][Object.keys(filesSell[0])];
    const filesRent         = await Residence.query().where('rule', rule).where('type', 2).where('user_id', id).count('*');
    const filesRentCount    = filesRent[0][Object.keys(filesRent[0])];
    const filesRemove       = await Residence.query().where('rule', rule).where('archive', 2).where('user_id', id).count('*');
    const filesRemoveCount  = filesRemove[0][Object.keys(filesRemove[0])];
    const filesArchive      = await Residence.query().where('rule', rule).where('archive', 1).where('user_id', id).count('*');
    const filesArchiveCount = filesArchive[0][Object.keys(filesArchive[0])];
    const filesOnCheck      = await Residence.query().where('rule', rule).where('status', '!=', 1).where('user_id', id).count('*');
    const filesOnCheckCount = filesOnCheck[0][Object.keys(filesOnCheck[0])];
    const filesDenied       = await Residence.query().where('rule', rule).where('status', 3).where('user_id', id).count('*');
    const filesDeniedCount  = filesDenied[0][Object.keys(filesDenied[0])];
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
    const Creators          = await Creator.query().where('user_id', id).count('*');
    const CreatorsCount     = Creators[0][Object.keys(Creators[0])];
    const Shobe             = await User.query().where('parent_realestate_id', id).count('*');
    const ShobeCount        = Shobe[0][Object.keys(Shobe[0])];
    const json              = {
      filesCount,
      filesSellCount,
      filesRentCount,
      filesRemoveCount,
      filesArchiveCount,
      filesOnCheckCount,
      filesDeniedCount,
      advisorCount,
      eventCount,
      TicketFCount,
      CustomerFCount,
      shobeCount: ShobeCount,
      Transaction2Count,
      Favorite2Count,
      CreatorsCount,
    };
    return response.json(json);
  }

  async siteDefault({ auth, request, response }) {
    const { rule }       = request.headers();
    const files          = await Residence.query().where('type', '!=', 1).where('archive', 0).count('*');
    const filesCount     = files[0][Object.keys(files[0])];
    const residence      = await Residence.query().where('type', 1).where('archive', 0).count('*');
    const residenceCount = residence[0][Object.keys(residence[0])];
    const advisor        = await Adviser.query().where('is_advisor', 1).count('*');
    const advisorCount   = advisor[0][Object.keys(advisor[0])];
    const Shobe          = await User.query().where('is_realestate', 1).count('*');
    const ShobeCount     = Shobe[0][Object.keys(Shobe[0])];
    const Comment        = await ResidenceComment.query().count('*');
    const CommentCount   = Comment[0][Object.keys(Comment[0])];
    const Reserve        = await Reserved.query().count('*');
    const ReserveCount   = Reserve[0][Object.keys(Reserve[0])];
    const json           = {
      advisorCount,
      residenceCount,
      CommentCount,
      filesCount,
      ReserveCount,
      shobeCount: ShobeCount,
    };
    return response.json(json);
  }

  async staticPages({ auth, request, response }) {
    const { slug } = request.all();
    let json       = await StaticPages.query().where('slug', slug).last();
    return response.json(json);
  }

  async modalHomePages({ auth, request, response }) {
    return response.json(await SiteModalPages.all());
  }

  async homeASC({ auth, request, response }) {
    let rows = (await Database.raw('SELECT created_at,AVG((month_discount/all_area)) as avg FROM `residences` where month_discount != 0 and all_area != 0 GROUP by MONTH(created_at);'))[0];
    return response.json(rows);
  }

  async homeRegion({ auth, request, response }) {
    let amlak     = (await Database.raw('select regions.image ,regions.title ,count(*) as count,type from residences,regions where residences.region_id != 1 and residences.region_id = regions.id GROUP BY residences.region_id , type order by count DESC limit 4;'))[0];
    let residence = (await Database.raw('select regions.image ,regions.title ,count(*) as count,type from residences,regions,reserveds where residences.id = reserveds.residence_id and residences.type = 1 and residences.region_id = regions.id GROUP BY residences.region_id , type order by count DESC limit 4;'))[0];
    return response.json({ amlak, residence });
  }

  async homeFetchCountingAdmin({ auth, request, response }) {
    const files             = await Residence.query().count('*');
    const filesCount        = files[0][Object.keys(files[0])];
    const user              = await User.query().count('*');
    const userCount         = user[0][Object.keys(user[0])];
    const advisor           = await User.query().where('is_advisor', 1).count('*');
    const advisorCount      = advisor[0][Object.keys(advisor[0])];
    const RealEstateC       = await User.query().where('is_realestate', 1).count('*');
    const RealEstateCount   = RealEstateC[0][Object.keys(RealEstateC[0])];
    const BlogerC           = await User.query().where('is_bloger', 1).count('*');
    const BlogerCount       = BlogerC[0][Object.keys(BlogerC[0])];
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
    let residenceStatus     = (await Database.raw(`SELECT sum(case when status = '0' then 1 else 0 end) as countStatus0, sum(case when status = '1' then 1 else 0 end) as countStatus1, sum(case when status = '2' then 1 else 0 end) as countStatus2, sum(case when status = '3' then 1 else 0 end) as countStatus3, created_at from residences GROUP BY MONTH(created_at),YEAR(created_at);`))[0];
    let residenceType       = (await Database.raw(`SELECT sum(case when type = '1' then 1 else 0 end) as countType1, sum(case when type = '2' then 1 else 0 end) as countType2, sum(case when status = '3' then 1 else 0 end) as countType3, created_at from residences GROUP BY MONTH(created_at),YEAR(created_at);`))[0];
    let transactionType     = (await Database.raw('SELECT count(*) as count,created_at,type from residences GROUP BY MONTH(created_at),YEAR(created_at),type;'))[0];
    const json              = {
      transactionType,
      residenceStatus,
      residenceType,
      BlogerCount,
      userCount,
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
    const { page } = request.qs;
    const { type } = request.body;
    const limit    = 15;
    let user       = User.query().orderBy('id', 'DESC');
    if (type === 'realestate') {
      user
        .where('name', '!=', '-')
        .where('name_en', '!=', '-')
        .where('is_realestate', 1);
    } else if (type === 'advisor') {
      user
        .where('name', '!=', '-')
        .where('name_en', '!=', '-')
        .where('is_advisor', 1);
    } else if (type === 'blogger') {
      user
        .where('is_bloger', 1);
    }
    return response.json(await user.paginate(page, limit));
  }

  async userFindAdmin({ auth, request, response }) {
    const { id } = request.all();
    return response.json(await User.query().where('id', id)
      .with('residence')
      .with('transaction')
      .with('Ticket')
      .with('Event')
      .with('Customers')
      .with('Creators')
      .with('packageBuy')
      .with('favorite').last());
  }

  async userActiveAdmin({ auth, request, response }) {
    const {
            id,
            active,
          }     = request.all();
    let user    = await User.query().where('id', id).last();
    user.active = active;
    if (user.active === 1)
      user.userDetailsChange = 2;
    else
      user.userDetailsChange = 0;
    await user.save();
    let title;
    let description;

    if (user.active == 1) {
      await new Sms().activeUser(user.mobile);
      title       = 'حساب شما تایید شد';
      description = 'ما حساب شمارا بررسی و تایید کردیم.اکنون می توانید از امکانات بوم و بنا استفاده کنید';
    } else {

      title       = 'حساب شما رد شد';
      description = 'ما حساب شمارا بررسی و رد کردیم.';
    }
    let jsonNewticket          = {};
    let jsonNewTicketPm        = {};
    jsonNewticket.user_id      = user.id;
    jsonNewTicketPm.user_id    = auth.user.id;
    jsonNewticket.user_type    = 1;
    jsonNewticket.title        = title;
    jsonNewticket.description  = description;
    jsonNewticket.admin_answer = '';
    jsonNewticket.status       = 1;
    let newTicket              = await Ticket.create(jsonNewticket);
    jsonNewTicketPm.ticket_id  = newTicket.id;
    jsonNewTicketPm.user_type  = 'admin';
    jsonNewTicketPm.pm         = description;

    let newTicketPm = await TicketPm.create(jsonNewTicketPm);
    return response.json({ status_code: 200 });
  }

  async userActivePanelAdmin({ auth, request, response }) {
    const {
            id,
            userDetailsChange,
          }                = request.all();
    let user               = await User.query().where('id', id).last();
    user.userDetailsChange = userDetailsChange;
    await user.save();
    let title;
    let description;

    if (user.userDetailsChange == 2) {
      await new Sms().activeUser(user.mobile);
      title       = 'حساب شما تایید شد';
      description = 'ما حساب شمارا بررسی و تایید کردیم.اکنون می توانید از امکانات بوم و بنا استفاده کنید';
    } else if (user.userDetailsChange == 3) {
      title       = 'حساب شما رد شد';
      description = 'ما حساب شمارا بررسی و رد کردیم.';
    } else if (user.userDetailsChange == 0) {
      title       = 'حساب خود را تایید کنید';
      description = 'لطفا برای تکمیل اطلاعات حساب خود به بخش ویرایش مشخصات حساب مراجعه کنید.';
    }
    let jsonNewticket          = {};
    let jsonNewTicketPm        = {};
    jsonNewticket.user_id      = user.id;
    jsonNewTicketPm.user_id    = auth.user.id;
    jsonNewticket.user_type    = 1;
    jsonNewticket.title        = title;
    jsonNewticket.description  = description;
    jsonNewticket.admin_answer = '';
    jsonNewticket.status       = 1;
    let newTicket              = await Ticket.create(jsonNewticket);
    jsonNewTicketPm.ticket_id  = newTicket.id;
    jsonNewTicketPm.user_type  = 'admin';
    jsonNewTicketPm.pm         = description;

    let newTicketPm = await TicketPm.create(jsonNewTicketPm);
    return response.json({ status_code: 200 });
  }

  async userCreateAdmin({ auth, request, response }) {
    const {
            is_user,
            is_bloger,
            is_realestate,
            is_advisor,
            is_shobe,
            lastname,
            firstname,
            firstname_en,
            lastname_en,
            mobile,
            tell,
            postal_code,
            sos,
            national_id,
            birthday,
            male,
            email,
            about,
            address,
            kartMeli,
            avatar,
            lat,
            lng,
          }    = request.all();
    var u      = new User();
    u.password = 'Mah998877';
    //TODO: // send sms to user and now it password
    // // console.log(request.body.id);
    if (request.body.id != '') {
      u = await User.query().where('id', request.body.id).last();
    }

    u.pageSignup    = 1;
    u.active        = 1;
    u.is_user       = 1;
    u.is_bloger     = is_bloger;
    u.is_realestate = is_realestate;
    u.is_shobe      = is_shobe;
    u.is_advisor    = is_advisor;
    u.lastname      = lastname;
    u.firstname     = firstname;
    u.firstname_en  = firstname_en;
    u.lastname_en   = lastname_en;
    u.mobile        = mobile;
    u.tell          = tell;
    u.postal_code   = postal_code;
    u.sos           = sos;
    u.national_id   = national_id;
    u.birthday      = birthday;
    u.male          = male;
    u.email         = email;
    u.address       = address;
    u.about         = about;
    u.kart_meli     = kartMeli;
    u.lat           = lat;
    u.lng           = lng;
    u.avatar        = avatar;
    if (is_bloger == 1) {
      u.site_url     = request.body.site_url;
      u.social_url   = request.body.social_url;
      u.username     = request.body.username;
      u.usernameshow = request.body.usernameshow;
    }
    if (is_advisor == 1) {
      u.parent_realestate_id = request.body.parent_realestate_id;
    }
    if (is_user == 1) {
      u.type               = request.body.type;
      u.bank_name          = request.body.bank_name;
      u.card_number        = request.body.card_number;
      u.shaba_number       = request.body.shaba_number;
      u.account_owner_name = request.body.account_owner_name;
      if (u.type == 2) {
        u.economic_code           = request.body.economic_code;
        u.statute                 = request.body.statute;
        u.business_license        = request.body.business_license;
        u.business_license_number = request.body.business_license_number;
      }
    }
    if (is_realestate == 1) {
      u.logo                    = request.body.logo;
      u.name                    = request.body.name;
      u.name_en                 = request.body.name_en;
      u.site_url                = request.body.site_url;
      u.social_url              = request.body.social_url;
      u.economic_code           = request.body.economic_code;
      u.postal_code             = request.body.postal_code;
      u.business_license        = request.body.business_license;
      u.business_license_number = request.body.business_license_number;
      u.statute                 = request.body.statute;
      u.bio                     = request.body.bio;
    }
    await u.save();

    return response.json({ status_code: 200 });
  }

  async loginActivityFetch({ auth, request, response }) {
    return response.json(await LoginActivity.query().where({ user_id: auth.user.id }).fetch());
  }

  async requestEnablePanel({ auth, request, response }) {
    let {
          is_realestate,
          is_advisor,
          is_bloger,
          is_shobe,
          make_residence,
        }                 = request.all();
    let user              = await User.query().where('id', auth.user.id).last();
    user.is_panel_request = 1;
    user.is_realestate    = is_realestate;
    user.is_advisor       = is_advisor;
    user.is_bloger        = is_bloger;
    user.is_shobe         = is_shobe;
    user.make_residence   = make_residence;
    await user.save();
    return response.json({ status_code: 200 });
  }
}

module.exports = UserController;
