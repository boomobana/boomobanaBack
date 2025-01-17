'use strict';

const { randomNum }          = require('../Helper');
const Adviser                = use('App/Models/Adviser');
const Transaction            = use('App/Models/Transaction');
const RealEstateCustomer     = use('App/Models/RealEstateCustomer');
const Creator                = use('App/Models/Creator');
const Ticket                 = use('App/Models/Ticket');
const TicketPm               = use('App/Models/TicketPm');
const RealEstateEvent        = use('App/Models/RealEstateEvent');
const Residence              = use('App/Models/Residence');
const ViewAd                 = use('App/Models/ViewAd');
const AdviserRealEstate      = use('App/Models/AdviserRealEstate');
const FavoriteAd             = use('App/Models/FavoriteAd');
const BlogPost               = use('App/Models/BlogPost');
const User                   = use('App/Models/User');
const ResidenceComment       = use('App/Models/ResidenceComment');
const Reserved               = use('App/Models/Reserved');
const StaticPages            = use('App/Models/StaticPages');
const SiteModalPages         = use('App/Models/SiteModalPages');
const Region                 = use('App/Models/Region');
const Province               = use('App/Models/Province');
const LoginActivity          = use('App/Models/LoginActivity');
const RealEstate             = use('App/Models/RealEstate');
const RequestUsersRealestate = use('App/Models/RequestUsersRealestate');
const SaveRequest            = use('App/Models/SaveRequest');
const Moamelat               = use('App/Models/Moamelat');
const ContactUs              = use('App/Models/ContactUs');
const PasswordReset          = use('App/Models/PasswordReset');
const Resaneha               = use('App/Models/Resaneha');
const Database               = use('Database');
const Sms                    = use('App/Controllers/Http/SmsSender');
const { validate }           = use('Validator');
const Hash                   = use('Hash');

class UserController {
  async findUser({ request, response }) {
    return response.json(await User.query().where('username', request.body.slug).with('SocialUsers').with('residence', q => {
      q.where('archive', 0).where('status', 2);
    }).last());
  }

  async ResanehaFetch({ response }) {
    return response.json(await Resaneha.query().where('type', 1).fetch());
  }

  async ResanehaAdminFetch({ response }) {
    return response.json(await Resaneha.query().fetch());
  }

  async ResanehaAdd({ auth, request, response }) {
    if (request.body.id == 0)
      await Resaneha.create({
        title: request.body.title,
        url: request.body.url,
        type: request.body.type,
      });
    else
      await Resaneha.query().where('id', request.body.id).update({ ...request.body });
    return response.json({ status_code: 200 });
  }

  async ResanehaRemove({ auth, request, response }) {
    await Resaneha.query().where('id', request.body.id).delete();
    return response.json({ status_code: 200 });
  }

  async findUserReport({ auth, request, response }) {
    const id                  = request.body.id;
    const filesSell           = await Residence.query().where('type', 3).where('user_id', id).count('*');
    const filesSellCount      = filesSell[0][Object.keys(filesSell[0])];
    const filesRent           = await Residence.query().where('type', 2).where('user_id', id).count('*');
    const filesRentCount      = filesRent[0][Object.keys(filesRent[0])];
    const filesResidence      = await Residence.query().where('type', 1).where('user_id', id).count('*');
    const filesResidenceCount = filesResidence[0][Object.keys(filesResidence[0])];
    const Shobe               = await User.query().where('parent_realestate_id', id).count('*');
    const ShobeCount          = Shobe[0][Object.keys(Shobe[0])];
    const advisor             = await Adviser.query().where('id', id).count('*');
    const advisorCount        = advisor[0][Object.keys(advisor[0])];
    const Moamelats           = await Moamelat.query().where('realestate_id', id).count('*');
    const MoamelatsCount      = Moamelats[0][Object.keys(Moamelats[0])];

    let json = {
      filesSellCount,
      filesRentCount,
      filesResidenceCount,
      ShobeCount,
      MoamelatsCount,
      advisorCount,
    };
    return response.json(json);
  }

  async fetchMyUser({ auth, request, response }) {
    return response.json(json);
  }

  async fetchAllUserRealEstate({ auth, request, response }) {
    let userIds = [auth.user.id];
    if (auth.user.is_shobe == 1)
      userIds.push(parseInt(auth.user.parent_realestate_id));
    let shobes = await User.query().whereIn('parent_realestate_id', userIds).fetch();
    for (let shobe of shobes.rows) {
      if (userIds.filter(e => e == shobe.id).length === 0) {
        userIds.push(parseInt(shobe.id));
      }
    }
    let advisors = await AdviserRealEstate.query().whereIn('status', [1, 4]).whereIn('real_estate_id', userIds).fetch();
    for (let advisor of advisors.rows) {
      if (userIds.filter(e => e == advisor.adviser_id).length === 0) {
        userIds.push(parseInt(advisor.adviser_id));
      }
    }

    let reals2 = await AdviserRealEstate.query().whereIn('status', [1, 4]).whereIn('adviser_id', userIds).fetch();
    for (let real of reals2.rows) {
      if (userIds.filter(e => e == real.real_estate_id && real.real_estate_id != 0).length === 0) {
        userIds.push(parseInt(real.real_estate_id));
      }
    }
    let shobes2 = await User.query().whereIn('id', userIds).fetch();
    for (let shobe of shobes2.rows) {
      if (userIds.filter(e => e == shobe.parent_realestate_id).length === 0) {
        if (shobe.parent_realestate_id != 0)
          userIds.push(parseInt(shobe.parent_realestate_id));
      }
    }
    let shobes3 = await User.query().whereIn('parent_realestate_id', userIds).fetch();
    for (let shobe of shobes3.rows) {
      if (userIds.filter(e => e == shobe.id).length === 0) {
        userIds.push(parseInt(shobe.id));
      }
    }
    let advisors2 = await AdviserRealEstate.query().whereIn('status', [1, 4]).whereIn('real_estate_id', userIds).fetch();
    for (let advisor of advisors2.rows) {
      if (userIds.filter(e => e == advisor.adviser_id).length === 0) {
        userIds.push(parseInt(advisor.adviser_id));
      }
    }
    let reals22 = await AdviserRealEstate.query().whereIn('status', [1, 4]).whereIn('adviser_id', userIds).fetch();
    for (let real of reals22.rows) {
      if (userIds.filter(e => e == real.real_estate_id && real.real_estate_id != 0).length === 0) {
        userIds.push(parseInt(real.real_estate_id));
      }
    }
    return response.json(await User.query().whereIn('id', userIds).select([
      'id',
      'lastname',
      'firstname',
      'is_shobe',
      'is_realestate',
      'is_advisor',
    ]).fetch());
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
    userIsExist.avatar = avatar;
    userIsExist.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async fetchPostssearch({ auth, request, response }) {
    const {
            text,
            province_id,
          }     = request.all();
    let region3 = Region.query().where('province_id', province_id);
    if (text != '' && text != null)
      region3.where('title', 'like', `%${text}%`);
    let region2    = await region3.fetch();
    let province2  = await Province.query().where('title', 'like', '%' + text + '%').fetch();
    let residence3 = await Residence.query()
      .select(['id'])
      .where('title', 'like', '%' + text + '%').orWhere('description', 'like', '%' + text + '%').orWhere('real_address', 'like', '%' + text + '%')
      .fetch();
    let resIds     = [];
    for (let row of residence3.rows) {
      resIds.push(row.id);
    }
    let residence2 = await Residence.query()
      .whereIn('id', resIds)
      .where('province_id', province_id)
      .where('archive', 0)
      .where('status', 2)
      .fetch();

    let user3   = await User.query()
      .select(['id'])
      .where('firstname', 'like', '%' + text + '%')
      .orWhere('lastname', 'like', '%' + text + '%')
      .orWhere('firstname_en', 'like', '%' + text + '%')
      .orWhere('lastname_en', 'like', '%' + text + '%')
      .orWhere('name', 'like', '%' + text + '%')
      .orWhere('name_en', 'like', '%' + text + '%')
      .orWhere('mobile', 'like', '%' + text + '%')
      .orWhere('address', 'like', '%' + text + '%')
      .orWhere('username', 'like', '%' + text + '%')
      .fetch();
    let userIds = [];
    for (let row of user3.rows) {
      userIds.push(row.id);
    }
    let user2 = await User.query()
      .whereIn('id', userIds)
      .where('username', '!=', '-')
      .select(['id', 'firstname', 'lastname', 'avatar', 'username'])
      .fetch();

    let blogger3   = await BlogPost.query()
      .select(['id'])
      .where('title', 'like', '%' + text + '%')
      .orWhere('body', 'like', '%' + text + '%')
      .orWhere('body_more', 'like', '%' + text + '%')
      .fetch();
    let bloggerIds = [];
    for (let row of blogger3.rows) {
      bloggerIds.push(row.id);
    }
    let blogger2 = await BlogPost.query()
      .whereIn('id', bloggerIds)
      .where('province', province_id)
      .fetch();
    return response.json({
      type: 'region',
      'region': region2.rows,
      'province': province2.rows,
      'user': user2.rows,
      'blogger': blogger2.rows,
      'residence': residence2.rows,
    });
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
    let passsword        = String(randomNum(6));
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
    const allFiles       = await Residence.query().where('archive', 0).count('*');
    const allFilesCount  = allFiles[0][Object.keys(allFiles[0])];
    const ViewAdS        = await ViewAd.query().count('*').groupBy('created_at');
    const ViewAdCount    = ViewAdS[0][Object.keys(ViewAdS[0])];
    const regionS        = await Region.query().count('*').groupBy('created_at');
    const regionCount    = regionS[0][Object.keys(regionS[0])];
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
      ViewAdCount,
      allFilesCount,
      regionCount,
      ReserveCount,
      shobeCount: ShobeCount,
    };
    return response.json(json);
  }

  async staticPage({ request, response }) {
    const { slug } = request.all();
    let json       = await StaticPages.query().with('according').where('slug', slug).last();
    return response.json(json);
  }

  async staticPages({ response }) {
    let json = await StaticPages.query().with('according').fetch();
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
    let region    = (await Database.raw(`select * from regions where province_id = ${request.body.province_id};`))[0];
    let amlak     = (await Database.raw(`select regions.id, regions.image ,regions.title ,count(*) as count,type from residences,regions where residences.archive = 0 and residences.status = 2 and  residences.region_id != 1 and residences.province_id = ${request.body.province_id} and residences.region_id = regions.id GROUP BY residences.region_id , type order by count DESC;`))[0];
    let residence = (await Database.raw(`select regions.id, regions.image ,regions.title ,count(*) as count,type from residences,regions,reserveds where residences.archive = 0 and residences.status = 2 and  residences.id = reserveds.residence_id and residences.type = 1 and residences.province_id = ${request.body.province_id} and residences.region_id = regions.id GROUP BY residences.region_id , type order by count DESC;`))[0];
    let exp       = [];
    for (let regionElement of region) {
      let amlakEx     = amlak.filter(e => e.id == regionElement.id);
      let rahnEx      = amlakEx.filter(e => e.type == 2);
      let fororshEx   = amlakEx.filter(e => e.type == 3);
      let residenceEx = residence.filter(e => e.id == regionElement.id);
      let da          = { ...regionElement };
      if (rahnEx.length == 0)
        da.rahn = 0;
      else
        da.rahn = rahnEx[0].count;
      if (fororshEx.length == 0)
        da.fororsh = 0;
      else
        da.fororsh = fororshEx[0].count;
      if (residenceEx.length == 0)
        da.eghamatgah = 0;
      else
        da.eghamatgah = residenceEx[0].count;
      exp.push(da);
    }
    exp.sort((a, b) => {
      if (a.rahn > b.rahn) {
        return -1;
      }
    }).sort((a, b) => {
      if (a.fororsh > b.fororsh) {
        return -1;
      }
    }).sort((a, b) => {
      if (a.eghamatgah > b.eghamatgah) {
        return -1;
      }
    });
    return response.json(exp);
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
    const {
            type,
            firstname,
            lastname,
            mobile,
            active,
            pageSignup,
          }        = request.body;
    const limit    = 15;
    let user       = User.query().orderBy('id', 'DESC');
    if (type) {
      if (type === 'admin') {
        user.where('is_admin', 1);
      } else if (type === 'realestate') {
        user.where('is_realestate', 1).where('is_admin', '!=', 1);
        if (active !== '' && active !== null) {
          if (active == 1)
            user.where('active', 1).where('pageSignup', '=', 3).where('userDetailsChange', 2);
          else
            user.where('userDetailsChange', '!=', 2);
        }
      } else if (type === 'advisor') {
        user.where('is_advisor', 1).where('is_admin', '!=', 1);
        if (active !== '' && active !== null) {
          if (active == 1)
            user.where('active', 1).where('pageSignup', '=', 3).where('userDetailsChange', 2);
          else
            user.where('userDetailsChange', '!=', 2);
        }
      } else if (type === 'blogger') {
        user.where('is_bloger', 1).where('is_admin', '!=', 1);
        if (active !== '' && active !== null) {
          if (active == 1)
            user.where('active', 1).where('pageSignup', '=', 3).where('userDetailsChange', 2);
          else
            user.where('userDetailsChange', '!=', 2);
        }
      } else if (type === 'shobe') {
        user.where('is_shobe', 1).where('is_admin', '!=', 1);
        if (active !== '' && active !== null) {
          if (active == 1)
            user.where('active', 1).where('pageSignup', '=', 3).where('userDetailsChange', 2);
          else
            user.where('userDetailsChange', '!=', 2);
        }
      } else if (type === 'user') {
        user.where('is_admin', '!=', 1).where('is_realestate', '!=', 1).where('is_shobe', '!=', 1).where('is_advisor', '!=', 1).where('is_bloger', '!=', 1);
        if (active !== '' && active !== null) {
          if (active == 1)
            user.where('active', 1).where('pageSignup', '=', 3);
          else
            user.where('active', '!=', 1);
        }
      } else if (type === 'allAd') {
        user.where('is_realestate', 1).orWhere('is_shobe', 1).orWhere('is_advisor', 1);
      }
    }
    if (firstname && firstname !== '' && firstname !== null) {
      user.where('firstname', 'like', '%' + firstname + '%');
    }
    if (lastname && lastname !== '' && lastname !== null) {
      user.where('lastname', 'like', '%' + lastname + '%');
    }
    if (mobile && mobile !== '' && mobile !== null) {
      user.where('mobile', 'like', '%' + mobile + '%');
    }
    if (pageSignup && pageSignup !== '' && pageSignup !== null) {
      user.where('type', pageSignup);
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

  async addRequestUser({ auth, request, response }) {
    await RequestUsersRealestate.create({ ...request.body });
    return response.json({ status_code: 200 });
  }

  async fetchRequestUser({ auth, request, response }) {
    const { page } = request.qs;
    let limit      = 10;
    if (request.body.limit != null)
      limit = request.body.limit;
    let data = SaveRequest.query();
    return response.json(await data.paginate(page, limit));
  }

  async findRequestUser({ auth, request, response }) {
    let data = SaveRequest.query().where('id', request.body.id);
    return response.json(await data.last());
  }

  async userCreateAdmin({ auth, request, response }) {
    if (request.body.id == 0 || request.body.id == null) {
      await User.create({
        pageSignup: 1,
        active: 1,
        is_user: 1,
        ...request.all(),
      });
    } else {
      await User.query().where('id', request.body.id).update({
        ...request.all(), password: await Hash.make(request.body.password),
      });
    }
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

  async notExistUsername({ auth, request, response }) {
    return response.json({
      userNotExist: (await User.query().whereNot('id', auth.user.id).where('username', request.body.username).select([
        'id',
        'username',
      ]).fetch()).rows.length === 0,
    });
  }

  async addContactUs({ auth, request, response }) {
    await ContactUs.create(request.body);
    return response.json({ status_code: 200, status_text: 'successfully done' });
  }

  async fetchContactUs({ auth, request, response }) {
    const { page } = request.qs;
    const limit    = 10;
    let data       = await ContactUs.query().orderBy('id', 'desc').paginate(page, limit);
    return response.json(data);
  }
}

module.exports = UserController;
