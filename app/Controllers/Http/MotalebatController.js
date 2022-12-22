'use strict';
const Motalebat      = use('App/Models/Motalebat');
const MotalebatMali  = use('App/Models/MotalebatMali');
const MotalebatCheck = use('App/Models/MotalebatCheck');

class MotalebatController {
  async indexMotalebat({ request, response, auth }) {
    if (request.body.id) {
      return response.json(await Motalebat.query().where('id', request.body.id).last());
    } else {
      let data = Motalebat.query();
      if (request.body.firstname && request.body.firstname != '')
        data.where('firstname', request.body.firstname);
      if (request.body.mobile && request.body.mobile != '')
        data.where('mobile', request.body.mobile);
      if (request.body.national_id && request.body.national_id != '')
        data.where('national_id', request.body.national_id);
      if (request.body.fathername && request.body.fathername != '')
        data.where('fathername', request.body.fathername);
      if (request.body.title && request.body.title != '')
        data.where('title', request.body.title);
      return response.json(await data.fetch());
    }
  }

  async addMotalebat({ request, response, auth }) {
    let mi;
    if (request.body.id != 0) {
      mi = await Motalebat.query().where('id', request.body.id).update(request.all());
      return response.json({ status_code: 200, status_text: 'Successfully Done', motalebat_id: request.body.id });
    } else {
      mi = await Motalebat.create({ ...request.all(), total: 0, user_id: auth.user.id });
    }
    return response.json({ status_code: 200, status_text: 'Successfully Done', motalebat_id: mi.id });
  }

  async indexMotalebatMali({ request, response, auth }) {
    if (request.body.id) {
      return response.json(await MotalebatMali.query().where('motalebat_mali', request.body.id).with('Check').fetch());
    } else if (request.body.id) {
      let data = MotalebatMali.query();

      if (request.body.lastname)
        data.where('lastname', request.body.lastname);
      if (request.body.lastname_taken)
        data.where('lastname_taken', request.body.lastname_taken);
      if (request.body.amount)
        data.where('amount', request.body.amount);
      if (request.body.date_reminder)
        data.where('date_reminder', request.body.date_reminder);
      if (request.body.type_payment)
        data.where('type_payment', request.body.type_payment);
      if (request.body.type_s)
        data.where('type_s', request.body.type_s);

      return response.json(await data.fetch());
    }
  }

  async addMotalebatMali({ request, response, auth }) {
    let mm;
    if (request.body.id) {
      mm = await MotalebatMali.query().where('id', request.body.id).update({
        ...request.all(),
        user_id: auth.user.id,
      });
      await this.checkMotalebatMali(request.body.motalebat_mali, request.body.amount);

      return response.json({ status_code: 200, status_text: 'Successfully Done', mtalebat_mali: request.body.id });
    } else {
      mm = await MotalebatMali.create({
        ...request.all(),
        user_id: auth.user.id,
      });
      await this.checkMotalebatMali(request.body.motalebat_mali, request.body.amount);
      return response.json({ status_code: 200, status_text: 'Successfully Done', mtalebat_mali: mm.id });
    }
  }

  async checkMotalebatMali(motalebat_id, amount) {
    console.log(motalebat_id);
    let plus = 0;
    let am   = await Motalebat.query().where('id', motalebat_id).last();
    console.log(am);
    if (am) {
      plus = parseInt(am.total) + parseInt(amount);
    } else {
      plus = parseInt(amount);
    }
    await Motalebat.query().where('id', motalebat_id).update({
      total: plus,
    });
  }

  async indexMotalebatCheck({ request, response, auth }) {
    if (request.body.id) {
      return response.json(await MotalebatCheck.query().where('id', request.body.id).last());
    } else if (request.body.id) {
      return response.json(await MotalebatCheck.query().fetch());
    }
  }

  async addMotalebatCheck({ request, response, auth }) {
    if (request.body.id) {
      await MotalebatCheck.query().where('id', request.body.id).update(request.all());
    } else {
      await MotalebatCheck.create({ ...request.all(), user_id: auth.user.id });
    }
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = MotalebatController;
