'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
var Adviser           = use('App/Models/Adviser'),
    PackageBuy        = use('App/Models/PackageBuy'),
    AdviserRealEstate = use('App/Models/AdviserRealEstate'),
    User              = use('App/Models/User'),
    Sms               = use('App/Controllers/Http/SmsSender'),
    { validate }      = use('Validator'),
    Database          = use('Database'),
    {
      randomNum,
    }                 = require('../Helper');

/**
 * Resourceful controller for interacting with packages
 */
class AdvisorController {
  async index({ auth, response }) {
    return response.json(await AdviserRealEstate.query().where('real_estate_id', auth.user.id).with('Realestate').with(['Advisor']).fetch());
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
        residenceStatus = await AdviserRealEstate.query().where('adviser_id', id).last();

    let mandeFile = residenceStatus.count_file_adviser,
        occousion = residenceStatus.count_occasion,
        video     = residenceStatus.count_video,
        toor      = 0,
        ladder    = residenceStatus.count_ladder,
        important = residenceStatus.count_instant,
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
    const rules      = {
      fileUrl: 'required',
      firstname: 'required',
      lastname: 'required',
      mobile: 'required|unique:advisers ,mobile',
      email: 'required',
      password: 'required',
      type: 'required',
      male: 'required',
      count_file_rent: 'required',
      count_file_sell: 'required',
      count_occasion: 'required',
      count_instant: 'required',
      count_ladder: 'required',
      count_video: 'required',
      count_file_adviser: 'required',
      count_file_archive: 'required',
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
          }        = request.all();
    const {
            rule,
          }        = request.headers();
    let newAdviser = new Adviser();

    newAdviser.is_advisor        = 1;
    newAdviser.userDetailsChange = 1;
    if (typeof request.body.id != undefined && request.body.id != null) {
      newAdviser = await Adviser.query().where('id', request.body.id).last();
    }
    newAdviser.firstname = firstname;
    newAdviser.lastname  = lastname;
    newAdviser.email     = email;
    newAdviser.mobile    = mobile;
    newAdviser.password  = password;
    newAdviser.role      = type;
    newAdviser.lat       = 0;
    newAdviser.lng       = 0;
    newAdviser.address   = '';
    // newAdviser.active_code = randomNum(6);
    newAdviser.avatar    = fileUrl;
    newAdviser.male      = male;
    let savedData        = await newAdviser.save();

    let newRealAdviserRealEstate = new AdviserRealEstate();
    if (typeof request.body.id != undefined && request.body.id != null) {
      newRealAdviserRealEstate = await AdviserRealEstate.query()
        .where('adviser_id', newAdviser.id)
        .where('real_estate_id', auth.user.id)
        .last();
    }
    newRealAdviserRealEstate.real_estate_id     = auth.user.id;
    newRealAdviserRealEstate.adviser_id         = newAdviser.id;
    newRealAdviserRealEstate.count_file_rent    = count_file_rent;
    newRealAdviserRealEstate.count_file_sell    = count_file_sell;
    newRealAdviserRealEstate.count_occasion     = count_occasion;
    newRealAdviserRealEstate.count_instant      = count_instant;
    newRealAdviserRealEstate.count_ladder       = count_ladder;
    newRealAdviserRealEstate.count_video        = count_video;
    newRealAdviserRealEstate.count_file_adviser = count_file_adviser;
    newRealAdviserRealEstate.count_file_archive = count_file_archive;
    newRealAdviserRealEstate.status             = 0;
    await newRealAdviserRealEstate.save();

    // await Sms.sendTemplate('مشاور گرامی درخواست عضویتی از سوی املاک برای شما ارسال شد', mobile);

    return response.json({ status_code: 200, id: newRealAdviserRealEstate.id });
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
      .where('is_realestate', '!=', 1)
      .where('is_shobe', '!=', 1)
      .fetch();
    if (ad.rows.length != 0) {
      let ada  = await AdviserRealEstate.query()
        .where('real_estate_id', auth.user.id)
        .where('adviser_id', ad.rows[0].id)
        .fetch();
      let adaa = await AdviserRealEstate.query()
        .where('adviser_id', ad.rows[0].id)
        .where('real_estate_id', '!=', auth.user.id)
        .fetch();
      return response.json({ ex: ad.rows.length == 1, exa: ada.rows.length != 0, exaa: adaa.rows.length != 0 });
    }
    return response.json({ ex: ad.rows.length == 1, exa: false, exaa: false });
  }

  async codeRequest({ auth, request, response }) {
    let { id } = request.all();
    let re     = await AdviserRealEstate.query().where('id', id).last();
    if (re.status == 0 || re.status == 3) {
      let code = randomNum(6);
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
    let re                   = await AdviserRealEstate.query().where('id', id).with('Realestate').last();
    if (re.status == 0) {
      let rea = await User.query().where('id', re.real_estate_id).last();
      if (status == 1) {
        if (re.smsCode == code) {
          re.status = status;
          await re.save();

          /* TODO update and change this line with a function  */
          let timeStamp            = new Date().getTime();
          let count_file           = re.count_file_rent;
          let count_video          = re.count_video;
          let count_ladder         = re.count_ladder;
          let count_occasion       = re.count_occasion;
          let count_instant        = re.count_instant;
          // set count different
          let count_different      = 0;
          let credit               = 90;
          let lastPackage          = await PackageBuy.query().where('user_id', auth.user.id).last();
          let lastTime             = 0;
          let lastDay              = 0;
          let last_count_file      = 0,
              last_count_video     = 0,
              last_count_ladder    = 0,
              last_count_occasion  = 0,
              last_count_instant   = 0,
              last_count_different = 0;
          if (!!lastPackage && lastPackage.after_time > 0) {
            lastTime = parseInt(lastPackage.after_time);
            if ((lastTime - parseInt(timeStamp)) > 0) {
              lastDay = (lastTime - parseInt(timeStamp));
              if (lastPackage.after_count_file >= 1)
                last_count_file = lastPackage.after_count_file;
              if (lastPackage.after_count_video >= 1)
                last_count_video = lastPackage.after_count_video;
              if (lastPackage.after_count_ladder >= 1)
                last_count_ladder = lastPackage.after_count_ladder;
              if (lastPackage.after_count_occasion >= 1)
                last_count_occasion = lastPackage.after_count_occasion;
              if (lastPackage.after_count_instant >= 1)
                last_count_instant = lastPackage.after_count_instant;
              if (lastPackage.after_count_different >= 1)
                last_count_different = lastPackage.after_count_different;
            }
          }
          let calcTime                     = (parseInt(credit) * 24 * 60 * 60 * 1000) + lastDay + timeStamp;
          let beforetime                   = lastTime;
          let time                         = calcTime;
          let newPackage                   = new PackageBuy();
          newPackage.user_id               = auth.user.id;
          newPackage.type_of               = 2;
          newPackage.package_id            = id;
          newPackage.status                = 1;
          newPackage.transaction_id        = randomNum(12);
          newPackage.count_file            = last_count_file;
          newPackage.count_video           = last_count_video;
          newPackage.count_ladder          = last_count_ladder;
          newPackage.count_occasion        = last_count_occasion;
          newPackage.count_instant         = last_count_instant;
          newPackage.count_different       = last_count_different;
          newPackage.after_count_file      = parseInt(last_count_file) + parseInt(count_file);
          newPackage.after_count_video     = parseInt(last_count_video) + parseInt(count_video);
          newPackage.after_count_ladder    = parseInt(last_count_ladder) + parseInt(count_ladder);
          newPackage.after_count_occasion  = parseInt(last_count_occasion) + parseInt(count_occasion);
          newPackage.after_count_instant   = parseInt(last_count_instant) + parseInt(count_instant);
          newPackage.after_count_different = parseInt(last_count_different) + parseInt(count_different);
          newPackage.time                  = beforetime;
          newPackage.after_time            = time;
          await newPackage.save();
          /* TODO update and change this line with a function  */

          // await new Sms().acceptedAdvisor(rea.name, auth.user.mobile);
          // await new Sms().acceptedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
          return response.json({ status_code: 200 });
        } else {
          return response.json({ status_code: 400 });
        }
      } else if (status == 2) {
        re.status = status;
        await re.save();
        // await new Sms().deniedAdvisor(rea.name, auth.user.mobile);
        // await new Sms().deniedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
      }
    } else if (re.status == 3) {
      let rea = await User.query().where('id', re.adviser_id).last();
      if (status == 4) {

        if (re.smsCode == code) {
          re.status = status;
          await re.save();

          /* TODO update and change this line with a function  */
          let timeStamp            = new Date().getTime();
          let count_file           = re.count_file_rent;
          let count_video          = re.count_video;
          let count_ladder         = re.count_ladder;
          let count_occasion       = re.count_occasion;
          let count_instant        = re.count_instant;
          // set count different
          let count_different      = 0;
          let credit               = 90;
          let lastPackage          = await PackageBuy.query().where('user_id', auth.user.id).last();
          let lastTime             = 0;
          let lastDay              = 0;
          let last_count_file      = 0,
              last_count_video     = 0,
              last_count_ladder    = 0,
              last_count_occasion  = 0,
              last_count_instant   = 0,
              last_count_different = 0;
          if (!!lastPackage && lastPackage.after_time > 0) {
            lastTime = parseInt(lastPackage.after_time);
            if ((lastTime - parseInt(timeStamp)) > 0) {
              lastDay = (lastTime - parseInt(timeStamp));
              if (lastPackage.after_count_file >= 1)
                last_count_file = lastPackage.after_count_file;
              if (lastPackage.after_count_video >= 1)
                last_count_video = lastPackage.after_count_video;
              if (lastPackage.after_count_ladder >= 1)
                last_count_ladder = lastPackage.after_count_ladder;
              if (lastPackage.after_count_occasion >= 1)
                last_count_occasion = lastPackage.after_count_occasion;
              if (lastPackage.after_count_instant >= 1)
                last_count_instant = lastPackage.after_count_instant;
              if (lastPackage.after_count_different >= 1)
                last_count_different = lastPackage.after_count_different;
            }
          }
          let calcTime                     = (parseInt(credit) * 24 * 60 * 60 * 1000) + lastDay + timeStamp;
          let beforetime                   = lastTime;
          let time                         = calcTime;
          let newPackage                   = new PackageBuy();
          newPackage.user_id               = auth.user.id;
          newPackage.type_of               = 2;
          newPackage.package_id            = id;
          newPackage.status                = 1;
          newPackage.transaction_id        = randomNum(12);
          newPackage.count_file            = last_count_file;
          newPackage.count_video           = last_count_video;
          newPackage.count_ladder          = last_count_ladder;
          newPackage.count_occasion        = last_count_occasion;
          newPackage.count_instant         = last_count_instant;
          newPackage.count_different       = last_count_different;
          newPackage.after_count_file      = parseInt(last_count_file) + parseInt(count_file);
          newPackage.after_count_video     = parseInt(last_count_video) + parseInt(count_video);
          newPackage.after_count_ladder    = parseInt(last_count_ladder) + parseInt(count_ladder);
          newPackage.after_count_occasion  = parseInt(last_count_occasion) + parseInt(count_occasion);
          newPackage.after_count_instant   = parseInt(last_count_instant) + parseInt(count_instant);
          newPackage.after_count_different = parseInt(last_count_different) + parseInt(count_different);
          newPackage.time                  = beforetime;
          newPackage.after_time            = time;
          await newPackage.save();
          /* TODO update and change this line with a function  */

          // await new Sms().acceptedAdvisor(rea.name, auth.user.mobile);
          // await new Sms().acceptedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
          return response.json({ status_code: 200 });
        } else {
          return response.json({ status_code: 400 });
        }
      } else if (status == 5) {
        re.status = status;
        await re.save();
        // await new Sms().deniedAdvisor(rea.name, auth.user.mobile);
        // await new Sms().deniedAdvisorTR(auth.user.firstname + ' ' + auth.user.lastname, rea.mobile);
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

  async requestAdviserFetchAdmin({ auth, request, response }) {
    const { page } = request.qs;
    const limit    = 10;

    let rea = AdviserRealEstate.query();

    if (request.body.userSelected != 0 && request.body.userSelected != undefined)
      rea.where('user_id', request.body.userSelected);

    return response.json(await rea.orderBy('id', 'desc').with('Advisor').with('Realestate').paginate(page, limit));
  }

}

module.exports = AdvisorController;
