'use strict';

const { validate } = require('@adonisjs/validator/src/Validator');
const Residence    = use('App/Models/Residence');

class ResidenceController {
  async Fetch({ request, response }) {
    let userIsExist = await Residence.query().with('File').last();
    return response.json(userIsExist);
  }

  async add({ request, response }) {
    const rules      = {
      name: 'required',
      description: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    let {
          name,
          description,
        } = request.all();

    let res         = new Residence();
    res.name        = name;
    res.description = description;
    res.save();
    response.json({ status_code: 200, status_text: 'Successfully Done' });
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

  async changeCapacity({ request, response }) {
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
}

module.exports = ResidenceController;
