'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const Transaction      = use('App/Models/Transaction');
const PackageBuy       = use('App/Models/PackageBuy');
const Package          = use('App/Models/Package');
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal         = ZarinpalCheckout.create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);

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
    console.log(price, description);
    if (status != 1)
      return response.send('payed before');
    let resp = await zarinpal.PaymentRequest({
      Amount: price, // In Tomans
      CallbackURL: 'http://localhost:3333/api/realEstate/gateway/zarinpal/verify/' + slug,
      Description: description,
    });
    console.log(resp);
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
    console.log(resp);
    if (resp.status !== 100) {
      return response.send('not');
      console.log('Empty!');
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
            }                            = await Package.query().where('id', ref_3).last();
        let newPackage                   = new PackageBuy();
        newPackage.user_id               = user_id;
        newPackage.type_of               = 2;
        newPackage.package_id            = ref_3;
        newPackage.status                = 1;
        newPackage.transaction_id        = id;
        newPackage.count_file            = count_file;
        newPackage.count_video           = count_video;
        newPackage.count_ladder          = count_ladder;
        newPackage.count_occasion        = count_occasion;
        newPackage.count_instant         = count_instant;
        newPackage.count_different       = count_different;
        newPackage.after_count_file      = count_file;
        newPackage.after_count_video     = count_video;
        newPackage.after_count_ladder    = count_ladder;
        newPackage.after_count_occasion  = count_occasion;
        newPackage.after_count_instant   = count_instant;
        newPackage.after_count_different = count_different;
        await newPackage.save();
      }
      console.log(`Verified! Ref ID: ${resp.RefID}`);
      return response.send(`Verified! Ref ID: ${resp.RefID}`);
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
}

module.exports = TransactionController;
