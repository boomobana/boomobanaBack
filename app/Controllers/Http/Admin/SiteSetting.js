'use strict';

const { validate }   = require('@adonisjs/validator/src/Validator');
const SiteModalPages = use('App/Models/SiteModalPages');
const StaticPages    = use('App/Models/StaticPages');
const SiteSettings   = use('App/Models/SiteSetting');

/**
 * Resourceful controller for interacting with creators
 */
class SiteSetting {
  async fetchModal({ request, response }) {
    return response.json(await SiteModalPages.query()
      .orderBy('id', 'desc')
      .fetch());
  }

  async addModal({ request, response }) {
    await SiteModalPages.query().where('id', request.input('id')).update(request.all());
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async fetch({ request, response }) {
    return response.json(await SiteSettings.query().orderBy('id', 'desc').fetch());
  }

  async add({ request, response }) {
    await SiteSettings.query().where('id', request.input('id')).update(request.all());
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async staticPagesFetch({ request, response }) {
    return response.json(await StaticPages.query().orderBy('id', 'desc').fetch());
  }

  async staticPagesEdit({ request, response }) {
    await StaticPages.query().where('id', request.input('id')).update(request.all());
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = SiteSetting;
