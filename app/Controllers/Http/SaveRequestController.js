'use strict';

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @typedef {import('@adonisjs/framework/src/View')} View */
const SaveRequest           = use('App/Models/SaveRequest');
const SaveRequestRealestate = use('App/Models/SaveRequestRealestate');
const { validate }          = use('Validator');

/**
 * Resourceful controller for interacting with saverequests
 */
class SaveRequestController {
  async index({ request, response, auth }) {
    return response.json(await SaveRequest.query().with('option').with('RTO2').with('RTO3').where('user_id', auth.user.id).fetch());
  }

  async indexReal({ request, response, auth }) {
    let arr = [];
    let RSQ = await SaveRequestRealestate.query().where('user_id', 50).fetch();
    // let RSQ = await SaveRequestRealestate.query().where('user_id', auth.user.id).fetch();
    // // console.log(RSQ.rows);
    for (let rsqElement of RSQ.rows) {
      arr.push(rsqElement.request_id);
    }
    return response.json(await SaveRequest.query().whereIn('id', arr).with('option').with('RTO2').with('RTO3').fetch());
  }

  async create({ request, response, auth }) {
    const rules      = {
      type: 'required',
      name: 'required',
      zaman_bazdid: 'required',
      zaman_karshenasi: 'required',
      metrazh: 'required',
      arz: 'required',
      tool: 'required',
      title: 'required',
      description: 'required',
      address: 'required',
      mobile: 'required',
    };
    const validation = await validate(request.all(), rules);
    if (validation.fails()) {
      return response.json(validation.messages());
    }
    const {
            type,
            name,
            zaman_bazdid,
            zaman_karshenasi,
            metrazh,
            arz,
            age,
            lat,
            lng,
            tool,
            title,
            description,
            address,
            mobile,
          }                      = request.all();
    const { rule }               = request.headers();
    const user                   = auth.user;
    let newReq                   = new SaveRequest();
    newReq.slug                  = Math.floor(Math.random() * (999999999999 - 111111111111) + 111111111111);
    newReq.user_id               = user.id;
    newReq.type                  = type;
    newReq.name                  = name;
    newReq.zaman_bazdid          = zaman_bazdid;
    newReq.zaman_tamas_karshenas = zaman_karshenasi;
    newReq.metrazh               = metrazh;
    newReq.arz                   = arz;
    newReq.tool                  = tool;
    newReq.title                 = title;
    newReq.description           = description;
    newReq.address               = address;
    newReq.mobile                = mobile;
    if (type == 3) {
      const rules2      = {
        area: 'required',
        price: 'required',
      };
      const validation2 = await validate(request.all(), rules2);
      if (validation2.fails()) {
        return response.json(validation2.messages());
      }
      const {
              area,
              price,
            }      = request.all();
      newReq.area  = area;
      newReq.price = price;
    } else {
      const rules3      = {
        rto_1: 'required',
        rto_2: 'required',
        age: 'required',
        lat: 'required',
        lng: 'required',

      };
      const validation3 = await validate(request.all(), rules3);
      if (validation3.fails()) {
        return response.json(validation3.messages());
      }
      const {
              age,
              lat,
              lng,
              rto_1,
              rto_2,
            }        = request.all();
      newReq.metrazh = metrazh;
      newReq.arz     = arz;
      newReq.age     = age;
      newReq.lat     = lat;
      newReq.lng     = lng;
      newReq.tool    = tool;
      newReq.rto_2   = rto_1;
      newReq.rto_3   = rto_2;
    }
    await newReq.save();
    return response.json({ status_code: 200, status_text: 'Successfully Done' });
  }
}

module.exports = SaveRequestController;
