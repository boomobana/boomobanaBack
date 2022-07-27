'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */

const Room         = use('App/Models/Room');
const { validate } = require('@adonisjs/validator/src/Validator');

/**
 * Resourceful controller for interacting with rooms
 */
class RoomController {
  async addRoom({ request, response }) {
    try {

      // const rules      = {
      //   residence_id: 'required',
      //   count_bed_1: 'required',
      //   count_bed_2: 'required',
      //   count_sonaty: 'required',
      //   count_mobl_takhtsho: 'required',
      //   type: 'required',
      //   other: 'required',
      // };
      // const validation = await validate(request.all(), rules);
      // if (validation.fails()) {
      //   return response.json(validation.messages());
      // }

      let {
            count_bed_1,
            count_bed_2,
            count_sonaty,
            count_mobl_takhtsho,
            type,
            other,
            residence_id,
          } = request.all();

      let roomS = new Room();
      // if (request.hasBody('id')) {
      //   let { id } = request.all();
      //   roomS  = await Room.query().where('id', id).last();
      // }
      if (request.hasBody('other')) {
        let { other } = request.all();
        roomS.other   = other;
      }
      roomS.residence_id        = parseInt(residence_id);
      roomS.count_bed_1         = parseInt(count_bed_1);
      roomS.count_bed_2         = parseInt(count_bed_2);
      roomS.count_sonaty        = parseInt(count_sonaty);
      roomS.count_mobl_takhtsho = parseInt(count_mobl_takhtsho);
      roomS.type                = String(type);
      roomS.save();
      response.json({ status_code: 200, status_text: 'Successfully Done' });
    } catch (e) {
      // // console.log(e);
      response.json({ status_code: 400, status_text: 'Unsuccessfully Done' });

    }
  }
}

module.exports = RoomController;
