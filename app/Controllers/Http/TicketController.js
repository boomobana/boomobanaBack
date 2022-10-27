'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const Ticket       = use('App/Models/Ticket'),
      TicketPm     = use('App/Models/TicketPm'),
      TicketFile   = use('App/Models/TicketFile'),
      User         = use('App/Models/User'),
      Sms          = use('App/Controllers/Http/SmsSender'),
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
    return response.json(await Ticket.query().where('user_id', auth.user.id).where('user_type', 1).with(['user']).with(['pm']).orderBy('id', 'desc').fetch());
  }

  async find({ request, response, auth }) {
    // check the user_type By User Type Table
    return response.json(await Ticket.query().where('id', request.body.id).where('user_type', 1).with(['user']).with(['pm']).orderBy('id', 'desc').last());
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
            file_url,
          }             = request.all();
    const {
            rule,
          }             = request.headers();
    let jsonNewticket   = {};
    let jsonNewTicketPm = {};
    if (rule === 'admin') {
      let user                = await User.query().where('id', request.input('id')).last();
      jsonNewticket.user_id   = user.id;
      jsonNewTicketPm.user_id = auth.user.id;
      await new Sms().reciveTicket(user.mobile);
    } else {
      jsonNewticket.user_id   = auth.user.id;
      jsonNewTicketPm.user_id = auth.user.id;
      await new Sms().sendTicket(auth.user.mobile);
    }
    //added table type user for this line below
    jsonNewticket.user_type    = 1;
    jsonNewticket.title        = title;
    jsonNewticket.description  = description;
    jsonNewticket.admin_answer = '';
    jsonNewticket.status       = 1;
    // let data               = await newTicket.save();
    let newTicket              = await Ticket.create(jsonNewticket);
    jsonNewTicketPm.ticket_id  = newTicket.id;
    if (rule === 'realEstate') {
      jsonNewTicketPm.user_type = 'amlak';
    } else {
      jsonNewTicketPm.user_type = rule;
    }
    jsonNewTicketPm.pm = description;
    if (file_url && file_url !== '')
      jsonNewTicketPm.file_url = file_url;

    let newTicketPm = await TicketPm.create(jsonNewTicketPm);
    return response.json({ status_code: 200, status_text: 'successfully done', id: newTicket.id });
  }

  /**
   * Create/save a new ticket.
   * POST tickets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const rules      = {
      ticket_id: 'required',
      user_type: 'required',
      pm: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }

    let {
          ticket_id,
          user_type,
          pm,
          file_url,
        }               = request.all();
    let newTicket       = new TicketPm();
    newTicket.ticket_id = ticket_id;
    newTicket.user_id   = auth.user.id;
    newTicket.user_type = user_type;
    newTicket.pm        = pm;
    if (file_url && file_url !== '')
      newTicket.file_url = file_url;

    await newTicket.save();

    let ticket2sda    = await Ticket.query().where('id', ticket_id).last();
    ticket2sda.status = user_type === 'admin' ? 2 : 1;
    await ticket2sda.save();

    let user = await User.query().where('id', ticket2sda.user_id).last();
    if (user_type === 'admin')
      await new Sms().answerTicket(user.mobile);
    else if (user_type === 'user')
      await new Sms().sendTicket(user.mobile);
    return response.json({ status_code: 200 });
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

  async ticketRemoveAdmin({ request, response, auth }) {
    let { id } = request.all();
    await Ticket.query().where('id', id).delete();
    return response.json({ status_code: 200 });
  }

  async ticketFetchAdmin({ params, request, response }) {
    const { page } = request.qs;
    const limit    = 15;
    let Tic        = Ticket.query().with('user').orderBy('id', 'desc');
    let Userss     = User.query();
    let userIn     = [];
    if (request.body.mobile != null && request.body.mobile != '')
      Userss.where('mobile', 'like', '%' + request.body.mobile + '%');
    if (request.body.lastname != null && request.body.lastname != '')
      Userss.where('lastname', 'like', '%' + request.body.lastname + '%');
    if (request.body.firstname != null && request.body.firstname != '')
      Userss.where('firstname', 'like', '%' + request.body.firstname + '%');
    if ((request.body.mobile != null && request.body.mobile != '') ||
      (request.body.lastname != null && request.body.lastname != '') ||
      (request.body.firstname != null && request.body.firstname != '')) {
      let us = (await Userss.fetch()).rows;
      for (let user of us) {
        userIn.push(user.id);
      }
      Tic.whereIn('user_id', userIn);
    }

    if (request.body.title != null && request.body.title != '')
      Tic.where('title', 'like', '%' + request.body.title + '%');
    if (request.body.status != null && request.body.status != '')
      Tic.where('status', request.body.status);
    return response.json(await Tic.paginate(page, limit));
  }

  async ticketAnswerAdmin({ params, request, response }) {
    const {
            id,
            answer,
          }             = request.all();
    let ticket          = await Ticket.query().where('id', id).last();
    ticket.admin_answer = answer;
    await ticket.save();
    return response.json({ status_code: 200 });
  }
}

module.exports = TicketController;
