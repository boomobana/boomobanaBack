'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

const Room         = require('../../Models/Room');
const { validate } = require('@adonisjs/validator/src/Validator');

/**
 * Resourceful controller for interacting with rooms
 */
class RoomController {
  async addRoom() {
    const rules      = {
      residence_id: 'required',
      count_bed_1: 'required',
      count_bed_2: 'required',
      count_sonaty: 'required',
      count_mobl_takhtsho: 'required',
      type: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          count_bed_1,
          count_bed_2,
          count_sonaty,
          count_mobl_takhtsho,
          type,
          residence_id,
        }   = request.all();
    let res = new Room();
    if (request.hasBody('id')) {
      let res = await Room.query().where('id', residence_id).last();
    }
    res.count_bed_1         = count_bed_1;
    res.count_bed_2         = count_bed_2;
    res.count_sonaty        = count_sonaty;
    res.count_mobl_takhtsho = count_mobl_takhtsho;
    res.type                = type;
    if (request.hasBody('body')) {
      let { other } = request.all();
      res.other     = other;
    }
    res.save();

    response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = RoomController;
