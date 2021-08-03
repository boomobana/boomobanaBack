'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const Ticket       = use('App/Models/Ticket'),
      { validate } = use('Validator');

/**
 * Resourceful controller for interacting with tickets
 */
class TicketController {
  /**
   * Show a list of all tickets.
   * GET tickets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    const {
            rule,
          } = request.headers();
    // check the user_type By User Type Table
    return response.json(await Ticket.query().where('user_id', auth.user.id).where('user_type', 1).with(['realEstate']).orderBy('id', 'desc').fetch());
  }

  /**
   * Render a form to be used for creating a new ticket.
   * GET tickets/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, auth }) {
    const rules      = {
      title: 'required',
      description: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const rulesHeaders      = {
      rule: 'required',
    };
    const validationHeaders = await validate(request.headers(), rulesHeaders);
    if (validationHeaders.fails()) {
      return response.json(validationHeaders.messages());
    }

    const {
            title,
            description,
          }                = request.all();
    const {
            rule,
          }                = request.headers();
    let newTicket          = new Ticket();
    newTicket.user_id      = auth.user.id;
    //added table type user for this line below
    newTicket.user_type    = 1;
    newTicket.title        = title;
    newTicket.description  = description;
    newTicket.admin_answer = '';
    newTicket.status       = 1;
    let data               = await newTicket.save();
    return response.json({ status_code: 200, status_text: 'successfully done' });
  }

  /**
   * Create/save a new ticket.
   * POST tickets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
  }

  /**
   * Display a single ticket.
   * GET tickets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing ticket.
   * GET tickets/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update ticket details.
   * PUT or PATCH tickets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a ticket with id.
   * DELETE tickets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ request, response, auth }) {
    const rules      = {
      id: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const rulesHeaders      = {
      rule: 'required',
    };
    const validationHeaders = await validate(request.headers(), rulesHeaders);
    if (validationHeaders.fails()) {
      return response.json(validationHeaders.messages());
    }
    let { id }      = request.all();
    let { rule }    = request.headers();
    let ticketFetch = await Ticket.query().where('id', id).last();
    console.log(auth.user.id);
    if (!!ticketFetch)
      if (ticketFetch.user_id === auth.user.id && ticketFetch.user_type === 1)
        if (ticketFetch.status === '1')
          await Ticket.query().where('id', id).delete();
        else
          return response.json({ status_code: 405, status_text: 'type Changed' });
      else
        return response.json({ status_code: 403, status_text: 'insufficient permission' });
    else
      return response.json({ status_code: 404, status_text: 'column not found' });

    return response.json({ status_code: 200, status_text: 'successfully done' });
  }
}

module.exports = TicketController;
