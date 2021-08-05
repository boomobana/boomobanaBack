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
  Route.post('/package', 'PackageController.index');
  Route.post('/login/with/mobile', 'AuthController.wihMobile');
  Route.post('/code/with/mobile', 'AuthController.wihMobileCode');
  Route.post('/final/code/signup', 'AuthController.FinalRegisterCode');
  Route.post('/login', 'AuthController.login');
  Route.post('/code', 'AuthController.getCode');
  Route.post('/register', 'AuthController.FinalRegister');
  Route.post('/forgot/code', 'AuthController.requestForgetPass');
  Route.post('/forgot/change', 'AuthController.changeForgotPassword');
}).middleware('guest');
Route.get('/streamImage/url/:filename', 'UploadFileController.Download');
Route.post('/find/user/details', 'UserController.findUser');

Route.group(() => {
  Route.get('/', () => {
    return { greeting: 'Hello world in JSON' };
  });
  Route.post('/upload', 'UploadFileController.Upload');

  Route.post('/me', 'AuthController.me');
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
}).prefix('api/realEstate').middleware(['auth:realEstate']);
Route.group(() => {
  Route.post('/ticket/list', 'TicketController.index');
  Route.post('/ticket/add', 'TicketController.create');
  Route.post('/ticket/delete', 'TicketController.destroy');
  Route.post('/polici/fetch', 'PoliciController.index');
  Route.post('/festivals', 'FestivalController.index');
  Route.post('/region', 'RegionController.index');
  Route.post('/province', 'ProvinceController.index');
  Route.post('/residence/fetch/last', 'ResidenceController.Fetch');
  Route.post('/residence/find', 'ResidenceController.Find');
}).prefix('api/realEstate');
