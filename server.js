'use strict';

/*
 |--------------------------------------------------------------------------
 | Http server
 |--------------------------------------------------------------------------
 |
 | This file bootstraps Adonisjs to start the HTTP server. You are free to
 | customize the process of booting the http server.
 |
 | """ Loading ace commands """
 |     At times you may want to load ace commands when starting the HTTP server.
 |     Same can be done by chaining `loadCommands()` method after
 |
 | """ Preloading files """
 |     Also you can preload files by calling `preLoad('path/to/file')` method.
 |     Make sure to pass a relative path from the project root.
 */
const fs          = require('fs');
const path        = require('path');
const https       = require('https');
const { Ignitor } = require('@adonisjs/ignitor');

const options = {
  key: fs.readFileSync(path.join(__dirname, './cert/private.pem')),
  cert: fs.readFileSync(path.join(__dirname, './cert/certificate.pem')),
};

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer((handler) => {
    return https.createServer(options, handler);
  })
  .then(() => {
    const server = use('Server');
    const Env    = use('Env');
    use('./start/socket')(server.getInstance());
  })
  .catch(console.error);
