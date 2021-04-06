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
  // Route.post('/login/with/mobile', 'UserController.wihMobile');
  Route.post('/login', 'UserController.login');
  Route.post('/code', 'UserController.getCode');
  Route.post('/register', 'UserController.FinalRegister');
  Route.post('/forgot/code', 'UserController.requestForgetPass');
  Route.post('/forgot/change', 'UserController.changeForgotPassword');
}).middleware('guest');
Route.post('/api/polici/fetch', 'PoliciController.index');
Route.post('/api/upload', 'UploadFileController.Upload');
Route.get('/streamImage/url/:filename', 'UploadFileController.Download');
Route.post('/get/festivals', 'FestivalController.index');
Route.post('/api/region', 'RegionController.index');
Route.post('/find/user/details', 'UserController.findUser');
Route.post('/api/province', 'ProvinceController.index');
Route.post('/api/residence/fetch/last', 'ResidenceController.Fetch');
Route.post('/api/residence/find', 'ResidenceController.Find');

Route.group(() => {
  Route.get('/', () => {
    return { greeting: 'Hello world in JSON' };
  });

  Route.post('/me', 'UserController.me');
  Route.post('/change/profile', 'UserController.changeProfile');
  Route.post('/change/avatar', 'UserController.changeAvatar');
  Route.post('/change/password', 'UserController.changePassword');
  Route.post('/residence/fetch/my/last', 'ResidenceController.FetchMy');

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
  Route.post('/residence/change/date', 'ResidenceController.changeDate');
  Route.post('/residence/price/max/man', 'ResidenceController.changePriceMaxMan');
  Route.post('/residence/rules/accept', 'ResidenceController.changeRules');

  Route.post('/residence/favorite/add', 'ResidenceController.favoriteAdd');

  Route.post('/panel/residence/favorite', 'ResidenceController.favoriteFetch');
  Route.post('/panel/search/save/text', 'ResidenceController.searchSaveText');
  Route.post('/panel/search/save/residence', 'ResidenceController.searchSavePost');
}).prefix('api').middleware('auth');

