'use strict';

const User = use('App/Models/User');

class UserController {
  async store({ request, response }) {
    try {
      const data = request.only(['username', 'email', 'password']);

      const [username, email] = await Promise.all([
        User.findBy('username', data.username),
        User.findBy('email', data.email),
      ]);

      if (username) {
        return response.status(409).send({
          error: { message: 'Username is already in use' },
        });
      }

      if (email) {
        return response.status(409).send({
          error: { message: 'E-mail is already in use' },
        });
      }

      const user = await User.create(data);

      return user;
    } catch (error) {
      return response.status(error.status || 500).send({
        error: { message: `Something didn't work out` },
      });
    }
  }
}

module.exports = UserController;
