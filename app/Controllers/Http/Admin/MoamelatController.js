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
          update,
        }            = request.all();
    let user_side1   = '';
    let user_side2   = '';
    let adviser_data = '';
    if (update.id_side1 == 0) {
      user_side1 = await MoamelatUser.create(side_1);
    } else {
      await MoamelatUser.query().where({ id: update.id_side1 }).update(side_1);
    }
    if (update.id_side2 == 0) {
      user_side2 = await MoamelatUser.create(side_2);
    } else {
      await MoamelatUser.query().where({ id: update.id_side2 }).update(side_2);
    }
    if (update.id_adviser == 0) {
      adviser_data = await MoamelatAdviser.create(adviser);
    } else {
      await MoamelatAdviser.query().where({ id: update.id_adviser }).update(adviser);
    }
    if (update.id == 0) {
      await Moamelat.create({
        realestate_id: auth.user.id,
        side_1: user_side1.id,
        side_2: user_side2.id,
        adviser_id: adviser_data.id,
        ...gharardad,
      });
    } else {
      await Moamelat.query().where({ id: update.id }).update({
        ...gharardad,
      });
    }
    return response.json({ status_code: 200 });
  }

  async fetchMoamele({ request, response, auth }) {
    let moa = Moamelat.query()
      .orderBy('id', 'desc')
      .with('Side1', q => {
        q.with('Region').with('Province');
      })
      .with('Side2', q => {
        q.with('Region').with('Province');
      })
      .with('Adviser')
      .with('User')
      .with('RTO_2')
      .with('RTO_3');

    if (request.body.userSelected != 0)
      moa.where('user_id', request.body.userSelected);

    return response.json(await moa.fetch());
  }

  async findMoamele({ request, response, auth }) {
    return response.json(await Moamelat.query()
      .where('realestate_id', auth.user.id)
      .where('id', request.input('id'))
      .orderBy('id', 'desc')
      .with('Side1', q => {
        q.with('Region').with('Province');
      })
      .with('Side2', q => {
        q.with('Region').with('Province');
      })
      .with('Adviser')
      .with('RTO_2')
      .with('RTO_3')
      .with('User')
      .last());
  }
}

module.exports = MoamelatController;
