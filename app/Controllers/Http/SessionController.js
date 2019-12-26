'use strict';

const User = use('App/Models/User');

class SessionController {
  async store({ request, response, auth }) {
    const { email, password } = request.all();

    const token = await auth.attempt(email, password);

    const { username } = await User.findBy('email', email);

    console.log(`> User ${username} authenticated with JWT`);

    return {
      username,
      token,
    };
  }
}

module.exports = SessionController;
