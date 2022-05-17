'use strict';
module.exports = function (server) {
  const io        = require('socket.io')(server, { cors: { origin: '*' } });
  const ChatIndex = use('App/Models/ChatIndex');
  const Chat      = use('App/Models/Chat');
  const User      = use('App/Models/User');
  io.on('connection', function (socket) {
    let getMessage = async data => {
      let chatIndex = await ChatIndex.query().where('user_id', socket.user.id).last();
      if (chatIndex) {
        socket.emit('getMessage', await Chat.query().where('slug', chatIndex.slug).with('user').fetch());
      } else {
        socket.emit('getMessage', []);
      }
    };
    let toAdmin    = (room, event, data) => {
      socket.to(room).emit('newMessage', data);
    };
    let toUser     = (room, event, data) => {
      socket.to(room).emit('newMessage', data);
    };
    socket.on('disconnect', (res) => {
      console.log(res);
    });
    console.log('connection created >>>', socket.id);
    socket.on('auth', async res => {
      let user    = await User.query().where('id', res.id).last();
      socket.user = user;
      socket.join(user.id);
      if (user.is_admin == 1) {
        socket.join('admin');
        socket.emit('auth', true);
      } else {
        socket.emit('auth', true);
      }
    });
    socket.on('getMessage', getMessage);
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
      getMessage({});
    });

  });
  io.of('admin').on('connection', function (socket) {
    socket.on('disconnect', (res) => {
      console.log(res);
    });
    console.log('connection created Admin >>>', socket.id);
    socket.on('auth', async res => {
      let user    = await User.query().where('id', res.id).last();
      socket.user = user;
    });
    let toAdmin = (room, event, data) => {
      socket.to(room).emit('newMessage', data);
    };
    let toUser  = (room, event, data) => {
      socket.to(room).emit('newMessage', data);
    };
  });
};
