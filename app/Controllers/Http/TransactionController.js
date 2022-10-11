'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const Transaction      = use('App/Models/Transaction');
const PackageBuy       = use('App/Models/PackageBuy');
const Package          = use('App/Models/Package');
const User             = use('App/Models/User');
const Ticket           = use('App/Models/Ticket');
const TicketPm         = use('App/Models/TicketPm');
const Env              = use('Env');
const ZarinpalCheckout = require('zarinpal-checkout');
const { rule }         = require('@adonisjs/validator/src/Validator');
const zarinpal         = ZarinpalCheckout.create(Env.get('ZARINPAL_MERCHANT_KEY'), false);
const Sms              = use('App/Controllers/Http/SmsSender');

/**
 * Resourceful controller for interacting with transactions
 */
class TransactionController {
  /**
   * Show a list of all transactions.
   * GET transactions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, auth }) {
    return response.json(await Transaction.query().where('user_id', auth.user.id).orderBy('id', 'desc').fetch());
  }

  /**
   * Render a form to be used for creating a new transaction.
   * GET transactions/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async send({ request, response, view }) {
    let {
          slug,
        } = request.params;
    let {
          price,
          description,
          status,
        } = await Transaction.query().where('slug', slug).last();
    // // console.log(price, description);
    if (status != 1)
      return response.send('payed before');
    let resp = await zarinpal.PaymentRequest({
      Amount: price, // In Tomans
      CallbackURL: `${Env.get('APP_URL')}/api/user/gateway/zarinpal/verify/${slug}`,
      Description: description,
    });
    // // console.log(resp);
    if (resp.status === 100) {
      let transaction   = await Transaction.query().where('slug', slug).last();
      transaction.ref_1 = resp.authority;
      transaction.save();

      return response.redirect(resp.url);
    }
  }

  /**
   * Create/save a new transaction.
   * POST transactions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async verify({ request, response }) {
    let { slug }      = request.params;
    let { Authority } = request.get();
    let {
          id,
          ref_1,
          ref_3,
          user_id,
          price,
        }             = await Transaction.query().where('slug', slug).last();
    let resp          = await zarinpal.PaymentVerification({
      Amount: price, // In Tomans
      Authority: ref_1,
    });
    // // console.log(resp);
    if (resp.status !== 100) {
      return response.redirect(`${Env.get('VIEW_URL')}/pay/unsuccess`);
      // // console.log('Empty!');
    } else {
      let transaction    = await Transaction.query().where('slug', slug).last();
      transaction.status = 2;
      transaction.ref_2  = resp.RefID;
      transaction.save();
      if (transaction.type_of_transaction === 'package') {
        let {
              count_file,
              count_video,
              count_ladder,
              count_occasion,
              count_instant,
              count_different,
              credit,
            }                    = await Package.query().where('id', ref_3).last();
        let timeStamp            = new Date().getTime();
        let lastPackage          = await PackageBuy.query().where('user_id', transaction.user_id).last();
        let lastTime             = 0;
        let lastDay              = 0;
        let last_count_file      = 0,
            last_count_video     = 0,
            last_count_ladder    = 0,
            last_count_occasion  = 0,
            last_count_instant   = 0,
            last_count_different = 0;
        if (!!lastPackage && lastPackage.after_time > 0) {
          lastTime = parseInt(lastPackage.after_time);
          if ((lastTime - parseInt(timeStamp)) > 0) {
            lastDay = (lastTime - parseInt(timeStamp));
            if (lastPackage.after_count_file >= 1)
              last_count_file = lastPackage.after_count_file;
            if (lastPackage.after_count_video >= 1)
              last_count_video = lastPackage.after_count_video;
            if (lastPackage.after_count_ladder >= 1)
              last_count_ladder = lastPackage.after_count_ladder;
            if (lastPackage.after_count_occasion >= 1)
              last_count_occasion = lastPackage.after_count_occasion;
            if (lastPackage.after_count_instant >= 1)
              last_count_instant = lastPackage.after_count_instant;
            if (lastPackage.after_count_different >= 1)
              last_count_different = lastPackage.after_count_different;
          }
        }
        let calcTime                     = (parseInt(credit) * 24 * 60 * 60 * 1000) + lastDay + timeStamp;
        let beforetime                   = lastTime;
        let time                         = calcTime;
        let newPackage                   = new PackageBuy();
        newPackage.user_id               = user_id;
        newPackage.type_of               = 2;
        newPackage.package_id            = ref_3;
        newPackage.status                = 1;
        newPackage.transaction_id        = id;
        newPackage.count_file            = last_count_file;
        newPackage.count_video           = last_count_video;
        newPackage.count_ladder          = last_count_ladder;
        newPackage.count_occasion        = last_count_occasion;
        newPackage.count_instant         = last_count_instant;
        newPackage.count_different       = last_count_different;
        newPackage.after_count_file      = parseInt(last_count_file) + parseInt(count_file);
        newPackage.after_count_video     = parseInt(last_count_video) + parseInt(count_video);
        newPackage.after_count_ladder    = parseInt(last_count_ladder) + parseInt(count_ladder);
        newPackage.after_count_occasion  = parseInt(last_count_occasion) + parseInt(count_occasion);
        newPackage.after_count_instant   = parseInt(last_count_instant) + parseInt(count_instant);
        newPackage.after_count_different = parseInt(last_count_different) + parseInt(count_different);
        newPackage.time                  = beforetime;
        newPackage.after_time            = time;
        await newPackage.save();
        let user               = await User.query().where('id', transaction.user_id).last(),
            sms                = await new Sms().buyPackage(user.mobile),
            title              = 'وضعیت خرید بسته',
            description        = 'خرید بسته با موفقیت انجام شد',
            newTicket          = new Ticket();
        newTicket.user_id      = user.id;
        //added table type user for this line below
        newTicket.user_type    = 1;
        newTicket.title        = title;
        newTicket.description  = description;
        newTicket.admin_answer = '';
        newTicket.status       = 1;
        let data               = await newTicket.save();

        let newTicketPm       = new TicketPm();
        newTicketPm.ticket_id = newTicket.id;
        newTicketPm.user_id   = user.id;
        newTicketPm.user_type = 1;
        newTicketPm.pm        = description;
        await newTicketPm.save();
      }
      // // console.log(`Verified! Ref ID: ${resp.RefID}`);
      return response.redirect(`${Env.get('VIEW_URL')}/pay/success`);
    }
  }

  /**
   * Display a single transaction.
   * GET transactions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing transaction.
   * GET transactions/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update transaction details.
   * PUT or PATCH transactions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a transaction with id.
   * DELETE transactions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
  }

  async transactionFetchAdmin({ response }) {
    return response.json(await Transaction.query().paginate());
  }
}

module.exports = TransactionController;
