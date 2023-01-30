'use strict';

const { validate }         = require('@adonisjs/validator/src/Validator');
const SiteModalPages       = use('App/Models/SiteModalPages');
const StaticPages          = use('App/Models/StaticPages');
const SiteSettings         = use('App/Models/SiteSetting');
const StaticPagesAccordion = use('App/Models/StaticPagesAccordion');
const ResidenceOption      = use('App/Models/ResidenceOption');

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
    return response.json(await StaticPages.query().with('according').orderBy('id', 'desc').fetch());
  }

  async staticPagesAccordingAdd({ request, response }) {
    if (request.input('id') != 0)
      await StaticPagesAccordion.query().where('id', request.input('id')).update({
        title: request.body.title,
        description: request.body.description,
      });
    else
      await StaticPagesAccordion.create({
        title: request.body.title,
        description: request.body.description,
        site_id: request.body.site_id,
      });

    return response.json({ status_code: 200, status_text: 'successfully Done' });
  }

  async staticPagesAccordingRemove({ request, response }) {
    await StaticPagesAccordion.query().where('id', request.input('id')).delete();
    return response.json({ status_code: 200, status_text: 'successfully Done' });
  }

  async staticPagesEdit({ request, response }) {
    await StaticPages.query().where('id', request.input('id')).update({
      title: request.body.title,
      body: request.body.body,
    });
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }

  async optionEdit({ request, response }) {
    await ResidenceOption.query().where('id', request.input('id')).update(request.all());
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = SiteSetting;
