'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.group(() => {
  Route.get('/', () => {
    return { greeting: 'Hello world in JSON' };
  });
  Route.post('/login', 'UserController.login');
  Route.post('/code', 'UserController.getCode');
  Route.post('/register', 'UserController.FinallRegister');
  Route.post('/forgot/code', 'UserController.requestForgetPass');
  Route.post('/forgot/change', 'UserController.changeForgotPassword');
}).middleware('guest');
Route.post('/api/upload', 'UploadFileController.Upload');
Route.get('/streamImage/url/:filename', 'UploadFileController.D   ownload');
Route.group(() => {
  Route.get('/', () => {
    return { greeting: 'Hello world in JSON' };
  });

  Route.post('/me', 'UserController.me');
  Route.post('/change/profile', 'UserController.changeProfile');
  Route.post('/change/password', 'UserController.changePassword');
  Route.post('/residence/fetch/last', 'ResidenceController.Fetch');

  Route.post('/residence/add', 'ResidenceController.add');
  Route.post('/residence/capacity', 'ResidenceController.changeCapacity');
  Route.post('/residence/location', 'ResidenceController.changeLocation');

  Route.post('/residence/file/add', 'ResidenceFileController.addPicture');
  Route.post('/residence/file/description', 'ResidenceFileController.changeDescription');
  Route.post('/residence/file/fetch', 'ResidenceFileController.fetchFile');

  Route.post('/residence/option/fetch', 'ResidenceOptionController.index');
  Route.post('/residence/option/connect/add', 'ResidenceOptionConnectController.create');

  Route.post('/residence/type/option/connect/add', 'ResidenceTypeOptionController.changeType');
  Route.post('/residence/type/option/connect/fetch', 'ResidenceTypeOptionController.index');

  Route.post('/residence/room/add', 'RoomController.addRoom');

  Route.post('/residence/season/add', 'SeasonConnectController.addSeason');

  Route.post('/region', 'RegionController.index');
  Route.post('/province', 'ProvinceController.index');
}).prefix('api').middleware('auth');

