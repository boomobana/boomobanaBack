'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const { randomNum }   = require('../Helper');
/** @typedef {import('@adonisjs/framework/src/View')} View */
var Adviser           = use('App/Models/Adviser'),
    PackageBuy        = use('App/Models/PackageBuy'),
    AdviserRealEstate = use('App/Models/AdviserRealEstate'),
    User              = use('App/Models/User'),
    Sms               = use('App/Controllers/Http/SmsSender'),
    { validate }      = use('Validator'),
    Database          = use('Database');

/**
 * Resourceful controller for interacting with packages
 */
class SubRealEstateController {
  async index({ auth, response }) {
    return response.json(await User.query().where('parent_realestate_id', auth.user.id).fetch());
  }

  async indexReport({ auth, response, request }) {
    let {
          id,
          from,
          to,
        }               = request.all(),
        allFiles        = (await Database
          .raw('select count(*) as count,created_at from residences where user_id = ? and created_at BETWEEN (?) AND (?) group by MONTH(created_at) order by YEAR(created_at) ASC , MONTH(created_at) ASC', [
            id,
            from,
            to,
          ]))[0],
        sellTransaction = (await Database
          .raw('select count(*) as count,created_at from residences where user_id = ? and type = 2 and  created_at BETWEEN (?) AND (?) group by MONTH(created_at) order by YEAR(created_at) ASC , MONTH(created_at) ASC', [
            id,
            from,
            to,
          ]))[0],
        rentTransaction = (await Database
          .raw('select count(*) as count,created_at from residences where user_id = ? and type = 3 and  created_at BETWEEN (?) AND (?) group by MONTH(created_at) order by YEAR(created_at) ASC , MONTH(created_at) ASC', [
            id,
            from,
            to,
          ]))[0],
        removed         = (await Database
          .raw('select count(*) as count,created_at from residences where user_id = ? and archive = 2 and created_at BETWEEN (?) AND (?) group by MONTH(created_at) order by YEAR(created_at) ASC , MONTH(created_at) ASC', [
            id,
            from,
            to,
          ]))[0],
        onCheck         = (await Database
          .raw('select count(*) as count,created_at from residences where user_id = ? and created_at BETWEEN (?) AND (?) group by MONTH(created_at) order by YEAR(created_at) ASC , MONTH(created_at) ASC', [
            id,
            from,
            to,
          ]))[0],
        archived        = (await Database
          .raw('select count(*) as count,created_at from residences where user_id = ? and archive = 1 and created_at BETWEEN (?) AND (?) group by MONTH(created_at) order by YEAR(created_at) ASC , MONTH(created_at) ASC', [
            id,
            from,
            to,
          ]))[0],
        sell            = (await Database
          .raw('select count(*) as count,created_at from residences where user_id = ? and type = 2 and  created_at BETWEEN (?) AND (?) group by MONTH(created_at) order by YEAR(created_at) ASC , MONTH(created_at) ASC', [
            id,
            from,
            to,
          ]))[0],
        rent            = (await Database
          .raw('select count(*) as count,created_at from residences where user_id = ? and type = 3 and  created_at BETWEEN (?) AND (?) group by MONTH(created_at) order by YEAR(created_at) ASC , MONTH(created_at) ASC', [
            id,
            from,
            to,
          ]))[0],
        residenceStatus = await PackageBuy.query().where('user_id', id).last(),
        enableAdviser   = await AdviserRealEstate.query().where('real_estate_id', id).with('Advisor', (q) => {
          q.where('disable', 1);
        }).fetch(),
        disableAdviser  = await AdviserRealEstate.query().where('real_estate_id', id).with('Advisor', (q) => {
          q.where('disable', 0);
        }).fetch();

    let mandeFile = residenceStatus ? residenceStatus.count_file_adviser : 0,
        occousion = residenceStatus ? residenceStatus.count_occasion : 0,
        video     = residenceStatus ? residenceStatus.count_video : 0,
        toor      = residenceStatus ? 0 : 0,
        ladder    = residenceStatus ? residenceStatus.count_ladder : 0,
        important = residenceStatus ? residenceStatus.count_instant : 0,
        json      = {
          allFiles: allFiles,
          sellTransaction: sellTransaction,
          rentTransaction: rentTransaction,
          removed: removed,
          onCheck: onCheck,
          archived: archived,
          sell: sell,
          rent: rent,
          mandeFile: mandeFile,
          occousion: occousion,
          video: video,
          toor: toor,
          ladder: ladder,
          important: important,
          enableAdviser: enableAdviser.rows.length,
          disableAdviser: disableAdviser.rows.length,
        };
    return response.json(json);
  }

  async find({ auth, response, request }) {
    const { id } = request.all();
    return response.json(await AdviserRealEstate.query().where('id', id).where('real_estate_id', auth.user.id).with(['Advisor']).last());
  }

  async create({ request, response, auth }) {
    const rulesHeaders      = {
      rule: 'required',
    };
    const validationHeaders = await validate(request.headers(), rulesHeaders);
    if (validationHeaders.fails()) {
      return response.json(validationHeaders.messages());
    }
    const rules = {
      fileUrl: 'required',
      firstname: 'required',
      lastname: 'required',
      mobile: 'required|unique:advisers ,mobile',
      email: 'required',
      password: 'required',
    };

    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const {
            fileUrl,
            firstname,
            lastname,
            mobile,
            email,
            password,
          }        = request.all();
    const {
            rule,
          }        = request.headers();
    let newAdviser = new Adviser();
    if (typeof request.body.id != undefined && request.body.id != null) {
      newAdviser = await Adviser.query().where('id', request.body.id).last();
    }
    newAdviser.firstname            = firstname;
    newAdviser.lastname             = lastname;
    newAdviser.email                = email;
    newAdviser.mobile               = mobile;
    newAdviser.password             = password;
    newAdviser.is_shobe             = 1;
    newAdviser.parent_realestate_id = auth.user.id;
    newAdviser.lat                  = 0;
    newAdviser.lng                  = 0;
    newAdviser.address              = '';
    // newAdviser.active_code = randomNum(12);
    newAdviser.avatar               = fileUrl;
    let savedData                   = await newAdviser.save();
    await (new Sms()).sendTemplate('شعبه گرامی جهت تکمیل اطلاعات به پنل خود مراجعه کنید', mobile);
    return response.json({ status_code: 200 });
  }

  async address({ request, response, auth }) {
    const rulesHeaders      = {
      rule: 'required',
    };
    const validationHeaders = await validate(request.headers(), rulesHeaders);
    if (validationHeaders.fails()) {
      return response.json(validationHeaders.messages());
    }
    const rules      = {
      id: 'required',
      address: 'required',
      lat: 'required',
      lng: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    const {
            address,
            id,
            lat,
            lng,
          }            = request.all();
    let newAdviser     = await Adviser.query().where('id', id).last();
    newAdviser.lat     = String(lat);
    newAdviser.lng     = String(lng);
    newAdviser.address = address;
    if (request.body.kartMeli && request.body.kartMeli !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.kart_meli = request.body.kartMeli;
    if (request.body.resome && request.body.resome !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.resome = request.body.resome;
    if (request.body.taeahodat && request.body.taeahodat !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.taeahodat = request.body.taeahodat;
    if (request.body.gharardad && request.body.gharardad !== '/eMEWqh8ab5-HCrjp7roTyaQFOhbtfcg-2SmSU9qP9D.png')
      newAdviser.gharardad = request.body.gharardad;
    let savedData = await newAdviser.save();

    return response.json({ status_code: 200, id: newAdviser.id });
  }

  async store({ request, response }) {
  }

  async show({ params, request, response, view }) {
  }

  async edit({ params, request, response, view }) {
  }

  async update({ params, request, response }) {
  }

  async destroy({ params, request, response }) {
  }

  async advisorDisableByRealestate({ request, response }) {
    let user     = await User.query().where('id', request.input('id')).last();
    user.disable = user.disable == 1 ? 0 : 1;
    await user.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async fetchAdvisorAdmin({ params, request, response }) {
    return response.json(await Adviser.query().where('advisor', 1).paginate());
  }

  async fetchRequestAdvisor({ auth, request, response }) {
    if (auth.user.is_advisor == 1)
      return response.json(await AdviserRealEstate.query().where('adviser_id', auth.user.id).where('status', 0).with('Realestate').with('Advisor').fetch());
    else if (auth.user.is_realestate == 1)
      return response.json(await AdviserRealEstate.query().where('real_estate_id', auth.user.id).where('status', 3).with('Realestate').with('Advisor').fetch());
  }

  async isExistAdvisor({ auth, request, response }) {
    let ad = await User.query()
      .where('firstname', request.input('firstname'))
      .where('lastname', request.input('lastname'))
      .where('mobile', request.input('mobile'))
      .fetch();
    return response.json({ ex: ad.rows.length == 1 });
  }

  async codeRequest({ auth, request, response }) {
    let { id } = request.all();
    let re     = await AdviserRealEstate.query().where('id', id).where('adviser_id', auth.user.id).last();
    if (re.status == 0 || re.status == 3) {
      let code   = randomNum(6);
      re.smsCode = code;
      await re.save();
      await new Sms().acceptAdvisor(code, auth.user.mobile);
      return response.json({ status_code: 200 });
    }
  }

  async isReqesutExistAdvisor({ auth, request, response }) {
    const {
            fileUrl,
            firstname,
            lastname,
            mobile,
            email,
            password,
            type,
            male,
            count_file_rent,
            count_file_sell,
            count_occasion,
            count_instant,
            count_ladder,
            count_video,
            count_file_adviser,
            count_file_archive,
          }                      = request.all();
    let newAdviser               = await Adviser.query()
      .where('firstname', request.input('firstname'))
      .where('lastname', request.input('lastname'))
      .where('mobile', request.input('mobile'))
      .last();
    let newRealAdviserRealEstate = new AdviserRealEstate();
    if (typeof request.body.id != undefined && request.body.id != null) {
      newRealAdviserRealEstate = await AdviserRealEstate.query()
        .where('adviser_id', newAdviser.id)
        .where('real_estate_id', auth.user.id)
        .last();
    } else {
      newRealAdviserRealEstate.count_file_rent    = 0;
      newRealAdviserRealEstate.count_file_sell    = 0;
      newRealAdviserRealEstate.count_occasion     = 0;
      newRealAdviserRealEstate.count_instant      = 0;
      newRealAdviserRealEstate.count_ladder       = 0;
      newRealAdviserRealEstate.count_video        = 0;
      newRealAdviserRealEstate.count_file_adviser = 0;
      newRealAdviserRealEstate.count_file_archive = 0;
      newRealAdviserRealEstate.real_estate_id     = auth.user.id;
      newRealAdviserRealEstate.adviser_id         = newAdviser.id;
    }
    newRealAdviserRealEstate.status = 0;
    await newRealAdviserRealEstate.save();

    return response.json({ status_code: 200 });
  }

  async checkRequestCode({ auth, request, response }) {
    let { status, code, id } = request.all();
    let re                   = await AdviserRealEstate.query().where('id', id).where('adviser_id', auth.user.id).with('Realestate').last();
    let rea                  = await User.query().where('id', re.real_estate_id).last();
    if (re.status == 0) {
      if (status === 4) {
        if (re.smsCode == code) {
          re.status = 4;
          await re.save();
          await new Sms().acceptedAdvisor(rea.name, auth.user.mobile);
          await new Sms().acceptedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
          return response.json({ status_code: 200 });
        } else {
          return response.json({ status_code: 400 });
        }
      } else if (status === 5) {
        re.status = 5;
        await re.save();
        await new Sms().deniedAdvisor(rea.name, auth.user.mobile);
        await new Sms().deniedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
      }
    } else if (re.status == 3) {
      if (status === 1) {
        if (re.smsCode == code) {
          re.status = 1;
          await re.save();
          await new Sms().acceptedAdvisor(rea.name, auth.user.mobile);
          await new Sms().acceptedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
          return response.json({ status_code: 200 });
        } else {
          return response.json({ status_code: 400 });
        }
      } else if (status === 2) {
        re.status = 2;
        await re.save();
        await new Sms().deniedAdvisor(rea.name, auth.user.mobile);
        await new Sms().deniedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
      }
    } else {
      return response.json({ status_code: 401 });
    }
  }

  async deactiveAdviser({ auth, request, response }) {
    let {
          id,
        }      = request.all();
    let rea    = await User.query().where('id', id).last();
    rea.active = 0;
    rea.save();
    return response.json({ status_code: 200 });
  }

}

module.exports = SubRealEstateController;
