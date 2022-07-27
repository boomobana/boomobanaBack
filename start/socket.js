'use strict';
module.exports = function (server) {
  const io           = require('socket.io')(server, { cors: { origin: '*' } });
  const ChatIndex    = use('App/Models/ChatIndex');
  const Chat         = use('App/Models/Chat');
  const User         = use('App/Models/User');
  let adminNamespace = io.of('admin');
  let userNamespace  = io.of('user');
  userNamespace.on('connection', function (socket) {
    socket.on('disconnect', (res) => {
      // console.log(res);
    });
    // console.log('connection created >>>', socket.id);
    socket.on('auth', async res => {
      // console.log(res);
      let user    = await User.query().where('id', res.id).last();
      socket.user = user;
      socket.join('user/' + user.id);
      socket.emit('auth', true);
    });
    socket.on('getMessage', async data => {
      // console.log('s', socket.user.id);
      let chatIndex = await ChatIndex.query().where('user_id', socket.user.id).last();
      if (chatIndex) {
        socket.emit('getMessage', await Chat.query().where('slug', chatIndex.slug).with('user').fetch());
      } else {
        socket.emit('getMessage', []);
      }
    });
    socket.on('newMessage', async data => {
      if (!(await ChatIndex.query().where('user_id', socket.user.id).last())) {
        await ChatIndex.create({
          user_id: socket.user.id,
          slug: 'aawda' + new Date().getTime() + 'awdawda',
        });
      }
      let chatIndex = await ChatIndex.query().where('user_id', socket.user.id).last();
      await Chat.create({
        user_id: socket.user.id,
        slug: chatIndex.slug,
        message: data.message,
        typeUser: 'user',
      });
      toAdmin('admin', 'newMessageReceived', true);
      toUser('user/' + socket.user.id, 'newMessageReceived', true);
    });
  });
  adminNamespace.on('connection', function (socket) {
    socket.on('disconnect', (res) => {
      // console.log(res);
    });
    // console.log('connection created >>>', socket.id);
    socket.on('auth', async res => {
      let user = await User.query().where('id', res.id).last();
      if (user.is_admin == 1) {
        socket.user = user;
        socket.join('admin/' + user.id);
        socket.join('admin');
        socket.emit('auth', true);
      }
    });
    socket.on('getMessage', async data => {
      let chatIndex = await ChatIndex.query().where('slug', data.slug).last();
      if (chatIndex) {
        socket.emit('getMessage', await Chat.query().where('slug', chatIndex.slug).with('user').fetch());
      } else {
        socket.emit('getMessage', []);
      }
    });
    socket.on('newMessage', async data => {
      /*if (!(await ChatIndex.query().where('user_id', socket.user.id).last())) {
        await ChatIndex.create({
          user_id: socket.user.id,
          slug: 'aawda' + new Date().getTime() + 'awdawda',
        });
      }*/
      let chatIndex = await ChatIndex.query().where('slug', data.slug).last();
      await Chat.create({
        user_id: socket.user.id,
        slug: chatIndex.slug,
        message: data.message,
        typeUser: 'admin',
      });
      toAdmin('admin', 'newMessageReceived', true);
      toUser('user/' + chatIndex.user_id, 'newMessageReceived', true);
    });

  });
  let toAdmin = (room, event, data) => {
    adminNamespace.to(room).emit(event, data);
  };
  let toUser  = (room, event, data) => {
    userNamespace.to(room).emit(event, data);
  };
};

