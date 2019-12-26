'use strict';

const Redis = use('Redis');
const User = use('App/Models/User');

class ChatController {
  constructor({ socket, request, auth }) {
    this.socket = socket;
    this.request = request;
    this.auth = auth;

    this.onOpen();
  }

  async onOpen() {
    console.log(
      '> Socket %s connected how %s',
      this.socket.id,
      this.auth.user.username
    );

    this.socket.broadcast('userOnline', this.auth.user.username);

    const users = await User.all();

    this.socket.emit('users', users);

    await Redis.set(this.auth.user.username, this.socket.id);
  }

  async onClose() {
    console.log(
      '> Socket %s disconnected how %s',
      this.socket.id,
      this.auth.user.username
    );

    this.socket.broadcastToAll('userOffline', this.auth.user.username);

    await Redis.set(this.auth.user.username, null);
  }

  async onMessage(data) {
    console.log(
      '> User %s send message using socket %s',
      this.auth.user.username,
      this.socket.id
    );

    const message = {
      ...data,
      owner: this.auth.user.username,
      date: new Date(),
    };

    this.socket.emit('message', message);

    const to = await Redis.get(data.to);
    if (to) {
      this.socket.emitTo('message', message, [to]);
    } else {
      console.log('> Socket of %s is offline', data.to);
    }
  }
}

module.exports = ChatController;
