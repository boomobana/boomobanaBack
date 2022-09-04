'use strict';

const { validate }   = require('@adonisjs/validator/src/Validator');
const SiteModalPages = use('App/Models/SiteModalPages');

/**
 * Resourceful controller for interacting with creators
 */
class SiteSetting {
  async fetchModal({ request, response, auth }) {
    return response.json(await SiteModalPages.query()
      .orderBy('id', 'desc')
      .fetch());
  }

  async addModal({ request, response, auth }) {
    await SiteModalPages.query().where('id', request.input('id')).update(request.all());
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = SiteSetting;
