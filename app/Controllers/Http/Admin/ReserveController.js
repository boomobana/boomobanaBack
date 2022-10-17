'use strict';

const Reserved = use('App/Models/Reserved');

/**
 * Resourceful controller for interacting with creators
 */
class ReserveController {
  async fetchList({ request, response }) {
    const { page } = request.qs;
    const limit    = 10;
    let Res        = Reserved.query().with('Residence').orderBy('id', 'desc');
    if (request.body.userSelected != 0 && request.body.userSelected != undefined)
      Res.where('user_id', request.body.userSelected);
    return response.json(await Res.paginate(page, limit));
  }
}

module.exports = ReserveController;
