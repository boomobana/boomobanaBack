'use strict';

const Wallet      = use('App/Models/Wallet');
const Transaction = use('App/Models/Transaction');
const Package     = use('App/Models/Package');
const PackageBuy  = use('App/Models/PackageBuy');
const User        = use('App/Models/User');
const Ticket      = use('App/Models/Ticket');
const TicketPm    = use('App/Models/TicketPm');
const {
        changeAmount,
        makeidF,
        makeid,
      }           = require('../Helper');
const Sms         = use('App/Controllers/Http/SmsSender');
const {
        validate,
      }           = use('Validator');
const Hash        = use('Hash');

class WalletController {
  async addWallet({ request, response }) {
    let ref1         = makeid(5, 5, 5);
    let ref2         = makeid(5, 5, 5);
    let payment_code = makeidF(8);
    let slug         = makeidF(8);
    await changeAmount(50, 1000, 1, 2, ref1, ref2, payment_code, slug);
  }

  async fetchWallet({ request, response, auth }) {
    return response.json(await Wallet.query().where('user_id', auth.user.id).orderBy('id', 'desc').fetch());
  }

  async packageBuy({ request, response, auth }) {
    let LW     = await Wallet.query().where('user_id', auth.user.id).orderBy('id', 'desc').limit(1).fetch();
    let { id } = request.params;
    let {
          title,
          price,
          discount,
        }      = await Package.query().where('id', id).last();

    if (LW.rows.length === 1 && LW.rows[0].available > price) {
      let slug                   = makeid(5, 10, 5);
      let newBuy                 = new Transaction();
      newBuy.user_id             = auth.user.id;
      newBuy.slug                = slug;
      newBuy.ref_2               = slug;
      newBuy.gateway             = 'kifpool';
      newBuy.type_of_transaction = 'package';
      newBuy.ref_3               = id;
      newBuy.price               = parseInt(price) - parseInt(discount);
      newBuy.price_without       = price;
      newBuy.description         = `خرید پکیج ${title}`;
      newBuy.status              = 2;
      await newBuy.save();
      let {
            count_file,
            count_video,
            count_ladder,
            count_occasion,
            count_instant,
            count_different,
            credit,
          }                    = await Package.query().where('id', id).last();
      let timeStamp            = new Date().getTime();
      let lastPackage          = await PackageBuy.query().where('user_id', auth.user.id).last();
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
      newPackage.user_id               = auth.user.id;
      newPackage.type_of               = 2;
      newPackage.package_id            = id;
      newPackage.status                = 1;
      newPackage.transaction_id        = newBuy.id;
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
      let user               = await User.query().where('id', auth.user.id).last(),
          sms                = await new Sms().buyPackage(user.mobile),
          titleW             = 'وضعیت خرید بسته',
          description        = 'خرید بسته با موفقیت انجام شد',
          newTicket          = new Ticket();
      newTicket.user_id      = user.id;
      //added table type user for this line below
      newTicket.user_type    = 1;
      newTicket.title        = titleW;
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
      await changeAmount(auth.user.id, newBuy.price, 0, 2, newBuy.slug,
        newBuy.ref_3, makeidF(10), makeidF(10));
      return response.json({ status_code: 200 });
    } else {
      return response.json({ status_code: 405 });
    }
  }
}

module.exports = WalletController;
