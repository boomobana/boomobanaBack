'use strict';

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Origin
  |--------------------------------------------------------------------------
  |
  | Set a list of origins to be allowed. The value can be one of the following
  |
  | Boolean: true - Allow current request origin
  | Boolean: false - Disallow all
  | String - Comma separated list of allowed origins
  | Array - An array of allowed origins
  | String: * - A wildcard to allow current request origin
  | Function - Receives the current origin and should return one of the above values.
  |
  */
  origin: [
    'capacitor://localhost',
    'ionic://localhost',
    'http://192.168.1.42:8887',
    'http://localhost',
    'http://localhost:8200',
    'http://localhost:8100',
    'http://localhost:4200',
    'http://localhost:4201',
    'http://localhost:4202',
    'http://192.168.1.42:4200',
    'http://192.168.1.42:4201',
    'http://192.168.1.42:4202',
    'https://admin.boomobana.com',
    'https://amlak.boomobana.com',
    'https://home.boomobana.com',
    'https://boomobana.com',
  ],

  /*
  |--------------------------------------------------------------------------
  | Methods
  |--------------------------------------------------------------------------
  |
  | HTTP methods to be allowed. The value can be one of the following
  |
  | String - Comma separated list of allowed methods
  | Array - An array of allowed methods
  |
  */
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],

  /*
  |--------------------------------------------------------------------------
  | Headers
  |--------------------------------------------------------------------------
  |
  | List of headers to be allowed via Access-Control-Request-Headers header.
  | The value can be one of the following.
  |
  | Boolean: true - Allow current request headers
  | Boolean: false - Disallow all
  | String - Comma separated list of allowed headers
  | Array - An array of allowed headers
  | String: * - A wildcard to allow current request headers
  | Function - Receives the current header and should return one of the above values.
  |
  */
  headers: true,

  /*
  |--------------------------------------------------------------------------
  | Expose Headers
  |--------------------------------------------------------------------------
  |
  | A list of headers to be exposed via `Access-Control-Expose-Headers`
  | header. The value can be one of the following.
  |
  | Boolean: false - Disallow all
  | String: Comma separated list of allowed headers
  | Array - An array of allowed headers
  |
  */
  exposeHeaders: false,

  /*
  |--------------------------------------------------------------------------
  | Credentials
  |--------------------------------------------------------------------------
  |
  | Define Access-Control-Allow-Credentials header. It should always be a
  | boolean.
  |
  */
  credentials: false,

  /*
  |--------------------------------------------------------------------------
  | MaxAge
  |--------------------------------------------------------------------------
  |
  | Define Access-Control-Allow-Max-Age
  |
  */
  maxAge: 90,
};
