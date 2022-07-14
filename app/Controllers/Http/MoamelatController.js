'use strict';
const { auth }        = require('mysql/lib/protocol/Auth');
const Moamelat        = use('App/Models/Moamelat'),
      MoamelatAdviser = use('App/Models/MoamelatAdviser'),
      MoamelatUser    = use('App/Models/MoamelatUser');

class MoamelatController {
  async createMoamele({ request, response, auth }) {
    let {
          side_1,
          side_2,
          adviser,
          gharardad,
        }            = request.all();
    let user_side1   = await MoamelatUser.create(side_1);
    let user_side2   = await MoamelatUser.create(side_2);
    let adviser_data = await MoamelatAdviser.create(adviser);
    await Moamelat.create({
      realestate_id: auth.user.id,
      side_1: user_side1.id,
      side_2: user_side2.id,
      adviser_id: adviser_data.id,
      ...gharardad,
    });
  }
}

module.exports = MoamelatController;
