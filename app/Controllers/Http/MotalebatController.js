'use strict';
const Motalebat      = use('App/Models/Motalebat');
const MotalebatMali  = use('App/Models/MotalebatMali');
const MotalebatCheck = use('App/Models/MotalebatCheck');

class MotalebatController {
  async indexMotalebat({ request, response, auth }) {
    if (request.body.id) {
      return response.json(await Motalebat.query().where('id', request.body.id).last());
    } else {
      return response.json(await Motalebat.query().fetch());
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
      return response.json(await MotalebatMali.query().fetch());
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
    let mm   = await MotalebatMali.query().where('motalebat_mali', motalebat_id).orderBy('id', 'desc').last();
    let plus = 0;
    if (mm) {
      plus = parseInt(mm.amount) + parseInt(amount);
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
