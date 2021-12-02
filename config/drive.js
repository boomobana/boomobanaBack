'use strict';

const Helpers = use('Helpers');
const Env     = use('Env');

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default disk
  |--------------------------------------------------------------------------
  |
  | The default disk is used when you interact with the file system without
  | defining a disk name
  |
  */
  default: 'ftp',

  disks: {
    /*
    |--------------------------------------------------------------------------
    | Local
    |--------------------------------------------------------------------------
    |
    | Local disk interacts with the a local folder inside your application
    |
    */
    local: {
      root: Helpers.tmpPath(),
      driver: 'local',
    },
    ftp: {
      driver: Env.get('FTP_DRIVER'),
      host: Env.get('FTP_HOST'),
      port: Env.get('FTP_PORT'),
      user: Env.get('FTP_USER'),
      pass: Env.get('FTP_PASS'),
    },
  },
};
