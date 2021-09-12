'use strict';

const { validate } = require('@adonisjs/validator/src/Validator');
const Residence    = use('App/Models/Residence');
const FavoriteAd   = use('App/Models/FavoriteAd');
const ViewAd       = use('App/Models/ViewAd');
const PackageBuy   = use('App/Models/PackageBuy');
const { sleep }    = require('../Helper');

class ResidenceController {
  async Fetch({ auth, request, response }) {
    let userIsExist = Residence.query().with('User').with('Files').with('Option').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').with('Season');
    if (typeof request.body.type === 'string') {
      if (request.body.type == 'residence') {
        userIsExist.where('type', '1');
        if (typeof request.body.text == 'string') {
          userIsExist.where('title', 'like', '%' + request.body.text + '%').orWhere('description', 'like', '%' + request.body.text + '%');
        }
      } else if (request.body.type == 'amlak') {
        userIsExist.where('type', '2');
        if (typeof request.body.text == 'string') {
          userIsExist.where('title', 'like', '%' + request.body.text + '%').orWhere('description', 'like', '%' + request.body.text + '%');
        }
      } else {
        userIsExist.orWhere('title', request.body.text);
      }
    }
    try {
      if (typeof request.body.save === 'boolean') {
        if (request.body.save === true) {
          if (!await ViewAd.query().where('text', request.body.text).where('user_id', auth.user.id).last()) {
            let va     = new ViewAd();
            va.text    = request.body.text;
            va.url     = 'type=' + request.body.type + '&text=' + request.body.text;
            va.user_id = auth.user.id;
            va.type    = 1;
            va.save();
          }
        }
      }
    } catch (e) {
      console.log(e);
    }

    return response.json(await userIsExist.fetch());
  }

  async favoriteFetch({ auth, request, response }) {
    let userIsExist = FavoriteAd.query().where('user_id', auth.user.id).orderBy('id', 'desc').with('Residence');

    return response.json(await userIsExist.fetch());
  }

  async favoriteAdd({ auth, request, response }) {
    let ad = await FavoriteAd.query().where('user_id', auth.user.id).where('ad_id', request.body.residence_id).last();
    if (ad) {
      console.log('here', ad.id);
      let rem = await FavoriteAd.find(ad.id);
      rem.delete();
      // rem.;
      console.log(rem);
    } else {
      let newFa     = new FavoriteAd();
      newFa.user_id = auth.user.id;
      newFa.ad_id   = request.body.residence_id;
      newFa.save();
    }
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async FetchMy({ auth, request, response }) {
    let userIsExist = Residence.query().orderBy('id', 'desc').where('user_id', auth.user.id).with('Files').with('Option').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').with('Season');

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
    if (typeof request.body.all_area === 'string' && request.body.all_area !== null && request.body.all_area !== '') {
      userIsExist.where('all_area', request.body.all_area);
    }
    if (typeof request.body.floor_area === 'string' && request.body.floor_area !== null && request.body.floor_area !== '') {
      userIsExist.where('floor_area', request.body.floor_area);
    }
    if (typeof request.body.month_discount === 'string' && request.body.month_discount !== null && request.body.month_discount !== '') {
      userIsExist.where('month_discount', request.body.month_discount);
    }
    if (typeof request.body.month_discount === 'string' && request.body.month_discount !== null && request.body.month_discount !== '')
      console.log(request.body);
    return response.json(await userIsExist.fetch());
  }

  async Find({ auth, request, response }) {
    let userIsExist = await Residence.query().where('id', request.body.residence_id).with('User').with('Files').with('Option').with('Season').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').last();
    try {
      if (typeof request.body.save === 'boolean') {
        if (request.body.save === true) {
          if (!await ViewAd.query().where('ad_id', request.body.residence_id).where('user_id', auth.user.id).last()) {
            let va     = new ViewAd();
            va.ad_id   = request.body.residence_id;
            va.user_id = auth.user.id;
            va.type    = 2;
            va.save();
          }
        }
      }
    } catch (e) {
      // console.log(e);
    }
    return response.json(userIsExist);
  }

  async add({ auth, request, response }) {
    const rules      = {
      title: 'required',
      description: 'required',
      type: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          title,
          description,
          type,
        }   = request.all();
    let res = new Residence();
    if (request.body.residence_id != 0) {
      res = await Residence.query().where('id', request.body.residence_id).last();
    }
    res.title       = title;
    res.description = description;
    res.type        = type;
    res.user_id     = auth.user.id;
    res.save();
    await sleep(1000);
    let residence = await Residence.query().where('title', '=', title).where('description', '=', description).where('user_id', '=', auth.user.id).last();
    response.json({ status_code: 200, status_text: 'Successfully Done', id: residence.id });
  }

  async addMelk({ auth, request, response }) {
    const rules      = {
      title: 'required',
      description: 'required',
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
      count_bathroom: 'required',
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
          count_bathroom,
        }   = request.all();
    let res = new Residence();
    if (request.body.residence_id != 0) {
      res = await Residence.query().where('id', request.body.residence_id).last();
    } else {
      let pack = await PackageBuy.query().where('user_id', auth.authenticator(rule).user.id).last();
      if (!!pack && pack.after_time < new Date().getTime() && pack.after_count_file < 1) {
        return response.json({ status_code: 204 });
      }
      pack.after_count_file -= 1;
      await pack.save();
    }
    res.title          = title;
    res.description    = description;
    res.real_address   = real_address;
    res.type           = type;
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
    res.count_bathroom = count_bathroom;
    res.user_id        = auth.user.id;
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
      province_id: 'required',
      region_id: 'required',
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
          province_id,
          region_id,
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
    res.province_id    = province_id;
    res.region_id      = region_id;
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
    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async searchSaveText({ auth, request, response }) {
    return response.json(await ViewAd.query().where('user_id', auth.user.id).where('type', '1').fetch());
  }

  async searchSavePost({ auth, request, response }) {
    return response.json(await ViewAd.query().where('user_id', auth.user.id).where('type', '2').with('Residence').fetch());
  }
}

module.exports = ResidenceController;
