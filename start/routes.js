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

Route.group(() => {
  Route.get('/', () => {
    return { greeting: 'Hello world in JSON' };
  });
  Route.post('/me', 'UserController.me');
  Route.post('/change/profile', 'UserController.changeProfile');
  Route.post('/change/password', 'UserController.changePassword');
  Route.post('/residence/fetch/last', 'ResidenceController.Fetch');
}).prefix('api').middleware('auth');

