'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const SeasonConnect = use('App/Models/SeasonConnect');
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate }  = require('@adonisjs/validator/src/Validator');

/**
 * Resourceful controller for interacting with seasonconnects
 */
class SeasonConnectController {
  async addSeason({ request, response }) {
    const rules      = {
      residence_id: 'required',
      sd_id: 'required',
      price: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    let {
          residence_id,
          sd_id,
          price,
        }      = request.all();
    let seasCo = new SeasonConnect();

    if (await SeasonConnect.query().where('sd_id', sd_id).where('residence_id', residence_id).last())
      seasCo = await SeasonConnect.query().where('sd_id', sd_id).where('residence_id', residence_id).last();

    seasCo.residence_id = parseInt(residence_id);
    seasCo.sd_id        = parseInt(sd_id);
    seasCo.price        = price;
    seasCo.save();

    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = SeasonConnectController;
