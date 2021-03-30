'use strict';

const { validate } = require('@adonisjs/validator/src/Validator');
const Residence    = use('App/Models/Residence');
const FavoriteAd   = use('App/Models/FavoriteAd');
const { sleep }    = require('../Helper');

class ResidenceController {
  async Fetch({ request, response }) {
    let userIsExist = Residence.query().with('Files').with('Option').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').with('Season');

    return response.json(await userIsExist.fetch());
  }

  async favoriteFetch({ request, response }) {
    let userIsExist = FavoriteAd.query().with('Residence');

    return response.json(await userIsExist.fetch());
  }

  async FetchMy({ auth, response }) {
    let userIsExist = await Residence.query().orderBy('id', 'desc').where('user_id', auth.user.id).with('Files').with('Option').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').with('Season').fetch();
    return response.json(userIsExist);
  }

  async Find({ request, response }) {
    let userIsExist = await Residence.query().where('id', request.body.residence_id).with('Files').with('Option').with('Season').with('Room').with('RTO1').with('RTO2').with('RTO3').with('Region').with('Province').last();
    return response.json(userIsExist);
  }

  async add({ auth, request, response }) {
    const rules      = {
      title: 'required',
      description: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          title,
          description,
        }   = request.all();
    let res = new Residence();
    if (request.body.residence_id != 0) {
      res = await Residence.query().where('id', request.body.residence_id).last();
    }
    res.title       = title;
    res.description = description;
    res.user_id     = auth.user.id;
    res.save();
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
}

module.exports = ResidenceController;
