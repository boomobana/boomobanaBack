'use strict';

const { validate }           = require('@adonisjs/validator/src/Validator');
const Residence              = use('App/Models/Residence');
const FavoriteAd             = use('App/Models/FavoriteAd');
const AdviserRealEstate      = use('App/Models/AdviserRealEstate');
const User                   = use('App/Models/User');
const ResidenceFile          = use('App/Models/ResidenceFile');
const ResidenceOptionConnect = use('App/Models/ResidenceOptionConnect');
const ResidenceComment       = use('App/Models/ResidenceComment');
const ViewAd                 = use('App/Models/ViewAd');
const PackageBuy             = use('App/Models/PackageBuy');
const { sleep }              = require('../Helper');
const Database               = use('Database');
const Ticket                 = use('App/Models/Ticket');
const TicketPm               = use('App/Models/TicketPm');

class ResidenceController {
  async Fetch({ auth, request, response }) {
    let {
          rule,
        }           = request.headers();
    let {
          options,
        }           = request.all();
    let {
          limit,
        }           = request.qs;
    let arrayOp     = [];
    let userIsExist = Residence.query()
      .with('User')
      .with('Files')
      .with('Option')
      .with('Room')
      .with('RTO1')
      .with('RTO2')
      .with('RTO3')
      .with('Region')
      .with('Province')
      .with('Season')
      .where('archive', 0)
      .where('status', 2);
    if (typeof request.body.text == 'string' && request.body.text != '' && request.body.text != null) {
      let userIsExist2 = await Residence.query()
        .orWhere('title', 'like', '%' + request.body.text + '%').orWhere('description', 'like', '%' + request.body.text + '%').fetch();
      let res          = [];
      for (let userIsExist2Element of userIsExist2.rows) {
        res.push(userIsExist2Element.id);
      }
      userIsExist.whereIn('id', res);
    }
    if (request.body.realestate && request.body.realestate != 0 && request.body.realestate != null) {
      userIsExist.whereIn('user_id', [request.body.realestate]);
    }
    if (typeof request.body.type === 'string') {
      if (request.body.type != 'nothing') {
        if (request.body.type == 'residence') {
          userIsExist.where('type', '1');
          if (request.body.typeResidence != 0) {
            if (request.body.typeResidence == 1) {
              userIsExist.whereNotIn('rto_2', ['5', '42']);
            } else {
              userIsExist.where('rto_2', request.body.typeResidence);
            }
          }
        } else if (request.body.type == 'amlak') {
          if (request.body.type2 != 0) {
            userIsExist.where('type', request.body.type2);
          } else {
            userIsExist.whereIn('type', [2, 3]);
          }
        }
      }
    }
    if (options.length != 0) {
      for (let i = 0; i < options.length; i++) {
        const item     = options[i];
        let getOptions = await ResidenceOptionConnect.query().where('residence_option_id', item.id).fetch();
        for (let j = 0; j < getOptions.rows.length; j++) {
          const opt = getOptions.rows[j];
          if (arrayOp.filter(e => e != opt.residence_id).length == 0) {
            arrayOp.push(opt.residence_id);
          }
        }
      }
      userIsExist.whereIn('id', arrayOp);
    }
    let pictureArray = [];
    if (request.body.photo) {
      let getFiles = await ResidenceFile.query().where('type', '1').groupBy('residence_id').fetch();
      for (let i = 0; i < getFiles.rows.length; i++) {
        const item = getFiles.rows[i];
        pictureArray.push(item.residence_id);
      }
      userIsExist.whereIn('id', pictureArray);
    }
    pictureArray = [];
    if (request.body.video) {
      let getFiles = await ResidenceFile.query().where('type', '2').groupBy('residence_id').fetch();
      for (let i = 0; i < getFiles.rows.length; i++) {
        const item = getFiles.rows[i];
        pictureArray.push(item.residence_id);
      }
      userIsExist.whereIn('id', pictureArray);
    }
    if (request.body.rto_1 && request.body.rto_1 != 0) {
      userIsExist.where('rto_2', request.body.rto_1);
    }
    if (request.body.rto_2 && request.body.rto_2 != 0) {
      userIsExist.where('rto_3', request.body.rto_2);
    }
    if (request.body.province != 0) {
      userIsExist.where('province_id', request.body.province);
    }
    if (request.body.region != 0) {
      userIsExist.where('region_id', request.body.region);
    }
    if (request.body.capacity != 0) {
      userIsExist.where('capacity_standard', request.body.capacity);
    }
    if (request.body.room != 0) {
      userIsExist.where('count_bathroom', request.body.room);
    }
    if (request.body.price1 != 0 && request.body.price2 != 0 && request.body.price1 != null && request.body.price2 != null) {
      userIsExist.where('month_discount', '>', request.body.price1).where('month_discount', '<', request.body.price2);
      // .orWhere('week_discount', '>', request.body.price1).orWhere('week_discount', '<', request.body.price2);
    }
    if (request.body.meter1 != 0 && request.body.meter2 != 0) {
      userIsExist.whereBetween('floor_area', [String(request.body.meter1), String(request.body.meter2)]);
    }
    if (request.body.sen1 != 0 && request.body.sen2 != 0) {
      userIsExist.where('age', '>', request.body.sen1).where('age', '<', request.body.sen2);
    }
    pictureArray = [];
    if (request.body.toor) {
      let getFiles = await ResidenceFile.query().where('type', '4').groupBy('residence_id').fetch();
      for (let i = 0; i < getFiles.rows.length; i++) {
        const item = getFiles.rows[i];
        pictureArray.push(item.residence_id);
      }
      userIsExist.whereIn('id', pictureArray);
    }
    pictureArray = [];
    if (request.body.panorama) {
      let getFiles = await ResidenceFile.query().where('type', '3').groupBy('residence_id').fetch();
      for (let i = 0; i < getFiles.rows.length; i++) {
        const item = getFiles.rows[i];
        pictureArray.push(item.residence_id);
      }
      userIsExist.whereIn('id', pictureArray);
    }
    try {
      if (typeof request.body.save === 'boolean') {
        if (request.body.save === true) {
          if (typeof request.body.text == 'string' && request.body.text != '' && request.body.text != null) {
            if (!await ViewAd.query().where('text', request.body.text).where('user_id', auth.user.id).last()) {
              let va     = new ViewAd();
              va.text    = request.body.text;
              va.url     = 'type=' + request.body.type + '&text=' + request.body.text;
              va.user_id = auth.user.id;
              va.ad_id   = 0;
              va.type    = 1;
              va.save();
            }
          }
        }
      }
    } catch (e) {
    }
    if (limit)
      userIsExist.limit(limit);
    return response.json(await userIsExist.fetch());
  }

  async FetchViewAd({ auth, request, response }) {
    const {
            id,
          } = request.all();
    return response.json(await ViewAd.query().where('ad_id', id).groupBy(Database.raw('year(created_at) ,month(created_at) ,day(created_at)')).select('created_at').count());
  }

  async FetchFavoriteAd({ auth, request, response }) {
    const {
            id,
          } = request.all();
    return response.json(await FavoriteAd.query().where('ad_id', id).count());
  }

  async favoriteFetch({ auth, request, response }) {
    let {
          rule,
        }           = request.headers();
    let userIsExist = FavoriteAd.query().where('user_id', auth.user.id).orderBy('id', 'desc').with('Residence');

    return response.json(await userIsExist.fetch());
  }

  async favoriteAdd({ auth, request, response }) {
    let {
          rule,
        }  = request.headers();
    let ad = await FavoriteAd.query().where('user_id', auth.user.id).where('ad_id', request.body.residence_id).last();
    if (ad) {
      let rem = await FavoriteAd.find(ad.id);
      rem.delete();
    } else {
      let newFa     = new FavoriteAd();
      newFa.user_id = auth.user.id;
      newFa.ad_id   = request.body.residence_id;
      newFa.save();
    }
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async FetchMy({ auth, request, response }) {
    let {
          rule,
        }       = request.headers();
    let userIds = [auth.user.id];
    if (auth.user.is_realestate == 1) {
      let advisors = await AdviserRealEstate.query().whereIn('status', [1, 4]).where('real_estate_id', auth.user.id).fetch();
      for (let advisor of advisors.rows) {
        if (userIds.filter(e => e == advisor.adviser_id).length === 0) {
          userIds.push(advisor.adviser_id);
        }
      }
      let shobes = await User.query().where('parent_realestate_id', auth.user.id).fetch();
      for (let shobe of shobes.rows) {
        if (userIds.filter(e => e == shobe.id).length === 0) {
          userIds.push(shobe.id);
        }
      }
    }
    let userIsExist = Residence.query().orderBy('id', 'desc').whereIn('user_id', userIds).with('Files').with('Option').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province');//.with('Season')
    if (rule == 'user')
      userIsExist.where('rule', 'user');
    else
      userIsExist.where('rule', '!=', 'user');

    if (typeof request.body.typeSearch === 'string' && request.body.typeSearch !== null && request.body.typeSearch !== '') {
      userIsExist.where('type', request.body.typeSearch);
    }
    if (typeof request.body.provinceId === 'string' && request.body.provinceId !== null && request.body.provinceId !== '') {
      userIsExist.where('province_id', request.body.provinceId);
    }
    if (typeof request.body.rto_2 === 'string' && request.body.rto_2 !== null && request.body.rto_2 !== '') {
      userIsExist.where('rto_2', request.body.rto_2);
    }
    if (typeof request.body.rto_3 === 'string' && request.body.rto_3 !== null && request.body.rto_3 !== '') {
      userIsExist.where('rto_3', request.body.rto_3);
    }
    if (typeof request.body.count_bathroom === 'string' && request.body.count_bathroom !== null && request.body.count_bathroom !== '') {
      userIsExist.where('count_bathroom', request.body.count_bathroom);
    }
    if (typeof request.body.age === 'string' && request.body.age !== null && request.body.age !== '') {
      userIsExist.where('age', request.body.age);
    }
    if (typeof request.body.floor_area === 'string' && request.body.floor_area !== null && request.body.floor_area !== '') {
      if (typeof request.body.floor_area2 === 'string' && request.body.floor_area2 !== null && request.body.floor_area2 !== '') {
        userIsExist.whereBetween('floor_area', [request.body.floor_area, request.body.floor_area2]);
      }
    }
    if (typeof request.body.month_discount === 'string' && request.body.month_discount !== null && request.body.month_discount !== '') {
      if (typeof request.body.month_discount2 === 'string' && request.body.month_discount2 !== null && request.body.month_discount2 !== '') {
        userIsExist.whereBetween('month_discount', [request.body.month_discount, request.body.month_discount2]);
      } else {
        userIsExist.where('month_discount', request.body.month_discount);
      }
    }
    if (typeof request.body.date1 === 'string' && request.body.date1 !== null && request.body.date1 !== '') {
      if (typeof request.body.date2 === 'string' && request.body.date2 !== null && request.body.date2 !== '') {
        userIsExist.whereBetween('created_at', [request.body.date1, request.body.date2]);
      }
    }
    if (typeof request.body.orderBy === 'string' && request.body.orderBy !== null && request.body.orderBy !== '') {
      if (request.body.orderBy == '1')
        userIsExist.orderBy('created_at', 'asc');
      else if (request.body.orderBy == '2')
        userIsExist.orderBy('created_at', 'desc');
      else if (request.body.orderBy == '4')
        userIsExist.orderBy('created_at', 'desc');
      // else if (request.body.orderBy == '3')
      //   userIsExist.orderBy('created_at', 'desc');
    }
    if (request.body.status != undefined && request.body.status != -1) {
      userIsExist.where('status', request.body.status);
    }
    if (typeof request.body.type_show === 'string' && request.body.type_show !== null && request.body.type_show !== '') {
      if (request.body.type_show == 1)
        userIsExist.where('archive', 0);
      else if (request.body.type_show == 2)
        userIsExist.where('archive', 1);
      else if (request.body.type_show == 3)
        userIsExist.where('archive', 3);
    } else {
      userIsExist.where('archive', '!=', 3);
    }
    // if (typeof request.body.month_discount === 'string' && request.body.month_discount !== null && request.body.month_discount !== '')
    return response.json(await userIsExist.fetch());
  }

  async Find({ auth, request, response }) {
    let {
          rule,
        }           = request.headers();
    let userIsExist = await Residence.query().where('id', request.body.residence_id).with('User').with('Files').with('Option').with('Season').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').with('Comment').last();
    try {
      if (typeof request.body.save === 'boolean') {
        if (request.body.save === true) {
          if (!await ViewAd.query().where('ad_id', request.body.residence_id).where('user_id', auth.user.id).last()) {
            let va     = new ViewAd();
            va.ad_id   = request.body.residence_id;
            va.user_id = auth.user.id;
            va.type    = 2;
            va.text    = '*';
            va.url     = '*';
            va.save();
          }
        }
      }
    } catch (e) {
    }
    return response.json(userIsExist);
  }

  async add({ auth, request, response }) {
    const rules      = {
      title: 'required',
      description: 'required',
      province_id: 'required',
      region_id: 'required',
      type: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          title,
          description,
          province_id,
          region_id,
          type,
        }   = request.all();
    let {
          rule,
        }   = request.headers();
    let res = new Residence();
    if (request.body.residence_id != 0) {
      res = await Residence.query().where('id', request.body.residence_id).last();
    }
    res.title       = title;
    res.description = description;
    res.province_id = province_id;
    res.region_id   = region_id;
    res.type        = type;
    res.rule        = rule;
    res.user_id     = auth.user.id;
    await res.save();
    await sleep(1000);
    let residence = await Residence.query().where('title', '=', title).where('description', '=', description).where('user_id', '=', auth.user.id).last();
    response.json({ status_code: 200, status_text: 'Successfully Done', id: residence.id });
  }

  async addMelk({ auth, request, response }) {
    const rules      = {
      title: 'required',
      description: 'required',
      archive: 'required',
      lat: 'required',
      lng: 'required',
      all_area: 'required',
      age: 'required',
      province_id: 'required',
      region_id: 'required',
      RTO1: 'required',
      RTO2: 'required',
      RTO3: 'required',
      real_address: 'required',
      month_discount: 'required',
      floor_area: 'required',
      width_area: 'required',
      height_area: 'required',
      // room_count: 'required',
      floor_count: 'required',
      floor_unit_count: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const {
            rule,
          }  = request.headers();
    let {
          title,
          description,
          real_address,
          type,
          lat,
          lng,
          province_id,
          region_id,
          RTO1,
          RTO2,
          RTO3,
          month_discount,
          floor_area,
          all_area,
          age,
          archive,
          count_bathroom,
          width_area,
          height_area,
          // room_count,
          floor_count,
          floor_unit_count,
        }    = request.all();
    let res  = new Residence();
    res.rule = rule;
    if (request.body.residence_id != 0) {
      res = await Residence.query().where('id', request.body.residence_id).last();
    } else {
      if (rule === 'realEstate') {
        let pack = await PackageBuy.query().where('user_id', auth.user.id).last();
        if (!!pack && pack.after_time < new Date().getTime() && pack.after_count_file < 1) {
          return response.json({ status_code: 204 });
        }
        pack.after_count_file -= 1;
        await pack.save();
      }
    }
    res.title          = title;
    res.description    = description;
    res.real_address   = real_address;
    res.type           = type;
    res.archive        = archive;
    res.lat            = lat;
    res.lng            = lng;
    res.province_id    = province_id;
    res.region_id      = region_id;
    res.all_area       = all_area;
    res.rto_1          = RTO1;
    res.rto_2          = RTO2;
    res.rto_3          = RTO3;
    res.month_discount = month_discount;
    res.floor_area     = floor_area;
    res.age            = age;
    res.width_area     = width_area;
    res.height_area    = height_area;
    if (type === '3')
      res.meter_price = request.body.meter_price;
    // res.room_count       = room_count;
    res.floor_count      = floor_count;
    res.floor_unit_count = floor_unit_count;
    res.count_bathroom   = count_bathroom;
    res.user_id          = auth.user.id;
    await res.save();
    await sleep(1000);
    let residence = await Residence.query().where('title', '=', title).where('description', '=', description).where('user_id', '=', auth.user.id).last();
    response.json({ status_code: 200, status_text: 'Successfully Done', id: residence.id });
  }

  async changeCapacity({ request, response }) {
    const rules      = {
      residence_id: 'required',
      capacity: 'required',
      capacity_standard: 'required',
      description_rom: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          capacity,
          capacity_standard,
          description_rom,
          residence_id,
        } = request.all();

    let res               = await Residence.query().where('id', residence_id).last();
    res.capacity          = capacity;
    res.capacity_standard = capacity_standard;
    res.description_rom   = description_rom;
    res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async changeLocation({ request, response }) {
    const rules      = {
      residence_id: 'required',
      count_toilet: 'required',
      count_bathroom: 'required',
      floor_area: 'required',
      all_area: 'required',
      postal_code: 'required',
      real_address: 'required',
      lat: 'required',
      lng: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          count_toilet,
          count_bathroom,
          floor_area,
          all_area,
          postal_code,
          real_address,
          lat,
          lng,
          residence_id,
        } = request.all();

    let res            = await Residence.query().where('id', residence_id).last();
    res.count_toilet   = count_toilet;
    res.count_bathroom = count_bathroom;
    res.floor_area     = floor_area;
    res.all_area       = all_area;
    res.postal_code    = postal_code;
    res.real_address   = real_address;
    res.lat            = lat;
    res.lng            = lng;
    res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async changeDate({ request, response }) {
    const rules      = {
      residence_id: 'required',
      before_reserve: 'required',
      start_delivery: 'required',
      end_delivery: 'required',
      discharge: 'required',
      after_reserve: 'required',
      min_reserve: 'required',
      max_reserve: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          before_reserve,
          start_delivery,
          end_delivery,
          discharge,
          after_reserve,
          min_reserve,
          max_reserve,
          residence_id,
        } = request.all();

    let res            = await Residence.query().where('id', residence_id).last();
    res.before_reserve = before_reserve;
    res.start_delivery = start_delivery;
    res.end_delivery   = end_delivery;
    res.discharge      = discharge;
    res.after_reserve  = after_reserve;
    res.min_reserve    = min_reserve;
    res.max_reserve    = max_reserve;
    res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async changePriceMaxMan({ request, response }) {
    const rules      = {
      residence_id: 'required',
      price_max_man: 'required',
      week_discount: 'required',
      month_discount: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          residence_id,
          price_max_man,
          week_discount,
          month_discount,
        } = request.all();

    let res            = await Residence.query().where('id', residence_id).last();
    res.price_max_man  = price_max_man;
    res.week_discount  = week_discount;
    res.month_discount = month_discount;
    res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async changeRules({ request, response }) {
    const rules      = {
      residence_id: 'required',
      sign_calendar: 'required',
      sign_rules_site: 'required',
      cancel_policy_id: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          residence_id,
          sign_calendar,
          sign_rules_site,
          cancel_policy_id,
        } = request.all();

    let res              = await Residence.query().where('id', residence_id).last();
    res.sign_calendar    = sign_calendar;
    res.sign_rules_site  = sign_rules_site;
    res.cancel_policy_id = cancel_policy_id;
    res.save();
    let rq    = await Residence.query().where('id', residence_id).last();
    rq.levels = 4;
    await rq.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async levelChange({ request, response }) {
    const rules      = {
      residence_id: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          residence_id,
        } = request.all();

    let rq    = await Residence.query().where('id', residence_id).last();
    rq.levels = 3;
    await rq.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async searchSaveText({ auth, request, response }) {
    const { rule } = request.headers();
    return response.json(await ViewAd.query().where('user_id', auth.user.id).where('type', '1').fetch());
  }

  async searchSavePost({ auth, request, response }) {
    const { rule } = request.headers();
    return response.json(await ViewAd.query().where('user_id', auth.user.id).where('type', '2').with('Residence').fetch());
  }

  async fileFetchAdmin({ auth, request, response }) {
    const { page } = request.qs;
    const limit    = 10;
    let Res        = Residence.query().with('RTO1').with('RTO2').with('RTO3').with('User').orderBy('id', 'desc');
    if (typeof request.body.user_id === 'string' && request.body.user_id !== null && request.body.user_id !== '') {
      Res.where('user_id', request.body.user_id);
    }
    if (typeof request.body.typeSearch === 'string' && request.body.typeSearch !== null && request.body.typeSearch !== '') {
      Res.where('type', request.body.typeSearch);
    }
    if (typeof request.body.status === 'string' && request.body.status !== null && request.body.status !== '') {
      Res.where('status', request.body.status);
    }
    if (typeof request.body.provinceId === 'string' && request.body.provinceId !== null && request.body.provinceId !== '') {
      Res.where('province_id', request.body.provinceId);
    }
    if (typeof request.body.rto_2 === 'string' && request.body.rto_2 !== null && request.body.rto_2 !== '') {
      Res.where('rto_2', request.body.rto_2);
    }
    if (typeof request.body.rto_3 === 'string' && request.body.rto_3 !== null && request.body.rto_3 !== '') {
      Res.where('rto_3', request.body.rto_3);
    }
    if (typeof request.body.count_bathroom === 'string' && request.body.count_bathroom !== null && request.body.count_bathroom !== '') {
      Res.where('count_bathroom', request.body.count_bathroom);
    }
    if (typeof request.body.all_area === 'string' && request.body.all_area !== null && request.body.all_area !== '') {
      Res.where('age', request.body.all_area);
    }
    if (typeof request.body.floor_area === 'string' && request.body.floor_area !== null && request.body.floor_area !== '') {
      if (typeof request.body.floor_area2 === 'string' && request.body.floor_area2 !== null && request.body.floor_area2 !== '') {
        Res.whereBetween('floor_area', [request.body.floor_area, request.body.floor_area2]);
      }
    }
    if (typeof request.body.month_discount === 'string' && request.body.month_discount !== null && request.body.month_discount !== '') {
      if (typeof request.body.month_discount2 === 'string' && request.body.month_discount2 !== null && request.body.month_discount2 !== '') {
        Res.whereBetween('month_discount', [request.body.month_discount, request.body.month_discount2]);
      }
    }
    if (typeof request.body.type_show === 'string' && request.body.type_show !== null && request.body.type_show !== '') {
      if (request.body.type_show == 1)
        Res.where('archive', 0);
      else if (request.body.type_show == 2)
        Res.where('archive', 1);
      else if (request.body.type_show == 3)
        Res.where('archive', 3);
    } else {
      Res.where('archive', '!=', 3);
    }
    if (request.body.userSelected != 0)
      Res.where('user_id', request.body.userSelected);
    return response.json(await Res.paginate(page, limit));
  }

  async fileFindAdmin({ auth, request, response }) {
    return response.json(await Residence.query().where('id', request.body.residence_id).with('User').with('Files').with('Option').with('Season').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').last());
  }

  async fileActiveAdmin({ auth, request, response }) {
    let res    = await Residence.query().where('id', request.body.id).last();
    res.status = request.body.status;
    await res.save();
    if (request.body.status == 3) {
      let jsonNewticket          = {};
      let jsonNewTicketPm        = {};
      let user                   = await User.query().where('id', res.user_id).last();
      jsonNewticket.user_id      = user.id;
      jsonNewTicketPm.user_id    = auth.user.id;
      jsonNewticket.user_type    = 1;
      jsonNewticket.title        = 'فایل شما رد شد';
      jsonNewticket.description  = request.body.text;
      jsonNewticket.admin_answer = '';
      jsonNewticket.status       = 1;
      let newTicket              = await Ticket.create(jsonNewticket);
      jsonNewTicketPm.ticket_id  = newTicket.id;
      jsonNewTicketPm.user_type  = 'admin';
      jsonNewTicketPm.pm         = request.body.text;

      let newTicketPm = await TicketPm.create(jsonNewTicketPm);
    }
    return response.json({ status_code: 200 });
  }

  async addMelkAdmin({ auth, request, response }) {
    const rules      = {
      title: 'required',
      description: 'required',
      archive: 'required',
      lat: 'required',
      lng: 'required',
      all_area: 'required',
      province_id: 'required',
      region_id: 'required',
      RTO1: 'required',
      RTO2: 'required',
      RTO3: 'required',
      real_address: 'required',
      month_discount: 'required',
      floor_area: 'required',
      width_area: 'required',
      height_area: 'required',
      // room_count: 'required',
      floor_count: 'required',
      floor_unit_count: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const {
            rule,
          } = request.headers();
    let {
          title,
          description,
          real_address,
          type,
          lat,
          lng,
          province_id,
          region_id,
          RTO1,
          RTO2,
          RTO3,
          month_discount,
          floor_area,
          all_area,
          archive,
          count_bathroom,
          width_area,
          height_area,
          // room_count,
          floor_count,
          floor_unit_count,
        }   = request.all();
    let res = new Residence();
    if (request.body.residence_id != 0) {
      res = await Residence.query().where('id', request.body.residence_id).last();
    } else {
      /*if (rule === 'realEstate') {
       let pack = await PackageBuy.query().where('user_id', auth.user.id).last();
       if (!!pack && pack.after_time < new Date().getTime() && pack.after_count_file < 1) {
       return response.json({ status_code: 204 });
       }
       pack.after_count_file -= 1;
       await pack.save();
       }*/
    }
    res.title          = title;
    res.description    = description;
    res.real_address   = real_address;
    res.type           = type;
    res.archive        = archive;
    res.lat            = lat;
    res.lng            = lng;
    res.province_id    = province_id;
    res.region_id      = region_id;
    res.all_area       = all_area;
    res.rto_1          = RTO1;
    res.rto_2          = RTO2;
    res.rto_3          = RTO3;
    res.month_discount = month_discount;
    res.floor_area     = floor_area;
    res.width_area     = width_area;
    res.height_area    = height_area;
    if (type === '3')
      res.meter_price = request.body.meter_price;
    // res.room_count       = room_count;
    res.floor_count      = floor_count;
    res.floor_unit_count = floor_unit_count;
    res.count_bathroom   = count_bathroom;
    // res.user_id          = auth.user.id;
    await res.save();
    await sleep(1000);
    // let residence = await Residence.query().where('title', '=', title).where('description', '=', description).where('user_id', '=', auth.user.id).last();
    response.json({ status_code: 200, status_text: 'Successfully Done', id: res.id });
  }

  async upgradeLevel({ auth, request, response }) {
    const {
            residence_id,
            different,
            instantaneous,
            Special,
            occasion,
          } = request.all();
    let res = await Residence.query().where('id', residence_id).last();
    if (different === true)
      res.different = 1;
    else
      res.different = 0;
    if (instantaneous === true)
      res.instantaneous = 1;
    else
      res.instantaneous = 0;
    if (Special === true)
      res.Special = 1;
    else
      res.Special = 0;
    if (occasion === true)
      res.occasion = 1;
    else
      res.occasion = 0;
    res.save();
    return response.json({ status_code: 200 });
  }

  async removeFile({ auth, request, response }) {
    let {
          id,
          reason,
        } = request.all();
    await Residence.query().where('id', id).update({
      archive: 3,
      removeReason: reason,
    });
  }

  async addResidenceComment({ auth, request, response }) {
    let data = await ResidenceComment.query().where('user_id', auth.user.id).where('residence_id', request.input('residence_id')).fetch();
    if (data.rows.length == 0)
      await ResidenceComment.create({ ...request.all(), user_id: auth.user.id, status: 0 });
    else
      await ResidenceComment.query().where('user_id', auth.user.id).where('residence_id', request.input('residence_id')).update({
        ...request.all(),
        status: 0,
      });
    return response.json({ status_code: 200, status_text: 'successfully done' });
  }

  async indexCommentAdmin({ request, response, auth }) {
    const { page } = request.qs;
    const limit    = 10;
    return response.json(await ResidenceComment.query().orderBy('id', 'desc').with('User').with('Residence').paginate(page, limit));
  }

  async activeCommentAdmin({ request, response, auth }) {
    await ResidenceComment.query().where('id', request.body.id).update({ status: request.body.status });
    return response.json({ status_code: 200 });
  }

}

module.exports = ResidenceController;
