'use strict';
// import { v4 as uuidv4 } from 'uuid';

const fs      = require('fs');
const Helpers = use('Helpers');
let driver    = use('Drive');
let Env       = use('Env');
const {
        sleep,
        makeid,
      }       = require('../Helper');

class UploadFileController {

  async Upload({ request, response }) {

    const profilePic = request.file('file', {
      types: ['image', 'video'],
      size: '2mb',
    });
    let type_file    = 1;
    switch (profilePic.subtype) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'svg':
      case 'bmp':
      case 'gif':
      case 'webp':
      case 'WEBP':
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'SVG':
      case 'BMP':
      case 'GIF':
        type_file = 1;
        break;
      case 'mkv':
      case 'webm':
      case 'mp4':
      case 'flv':
      case 'avi':
      case 'MKV':
      case 'WEBM':
      case 'MP4':
      case 'FLV':
      case 'AVI':
        type_file = 2;
        break;
    }
    let slug = makeid(10, 20, 10);
    let name = `${slug}.${profilePic.subtype}`;
    await profilePic.move(Helpers.tmpPath('uploads'), {
      name: name,
      overwrite: true,
    });
    await sleep(1000);
    try {
      let file = `${Helpers.tmpPath('uploads')}/${name}`;
      let dir  = Env.get('FTP_DIR');
      let data = Buffer.from(await fs.readFileSync(file));
      await driver.put(dir + name, data);
    } catch (e) {
      // // console.log(e);
    }

    if (!profilePic.moved()) {
      return profilePic.error();
    }
    return response.json({ status_code: 200, status_text: 'Successfully Done', name: name, type: type_file });
  }

  // async Download({ params, response }) {
  //   // // console.log(params.filename);
  //
  //   const filePath = `${Env.get('FTP_DIR')}${params.filename}`;
  //   // // console.log(filePath);
  //   try {
  //     // const isExist = await driver.exists(filePath);
  //     // await this.sleep(1000);
  //     // // // console.log(isExist);
  //     // if (isExist) {
  //       let file = await driver.exists(filePath);
  //       // // console.log(file);
  //       await this.sleep(5000);
  //       return response.download(file);
  //     // }
  //   } catch (e) {
  //     // // console.log('err');
  //   }
  //
  //   return 'File does not exist';
  // }
}

module.exports = UploadFileController;
