const Wallet   = use('App/Models/Wallet');
module.exports = {
  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  makeid: function (length = 12, length2 = 12, length3 = 12) {
    let result           = '',
        result2          = '',
        result3          = '',
        characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for (let o = 0; o < length2; o++) {
      result2 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for (let h = 0; h < length3; h++) {
      result3 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result + '-' + result2 + '-' + result3;
  },
  makeidF: function (length = 12) {
    let result           = '',
        characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  changeAmount: async function (user_id, amount, type, type_payment, ref_id1, ref_id2, payment_code, slug) {
    let last_amount = 0;
    let available   = 0;
    let ex          = await Wallet.query().where('user_id', user_id).orderBy('id', 'desc').limit(1).fetch();
    console.log(ex);
    if (ex.rows.length == 1) {
      last_amount = ex.rows[0].available;
    }
    if (type == 1) {
      available = last_amount + amount;
    } else {
      available = last_amount - amount;
    }
    await Wallet.create({
      past_amount: last_amount,
      available: available,
      cost: amount,
      user_id,
      type,
      type_payment,
      ref_id1,
      ref_id2,
      payment_code,
      slug,
    });
  },
};
