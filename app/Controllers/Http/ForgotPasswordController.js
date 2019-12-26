'use strict';

const moment = require('moment');
const crypto = require('crypto');

const User = use('App/Models/User');
const Mail = use('Mail');

class ForgotPasswordController {
  async store({ request, response }) {
    try {
      const email = request.input('email');
      const user = await User.findByOrFail('email', email);

      user.token = crypto.randomBytes(10).toString('hex');
      user.token_created_at = new Date();

      await user.save();

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`,
        },
        message => {
          message
            .to(user.email)
            .from('ellyofreitas@gmail.com', 'Ellyo Freitas')
            .subject('Recuperação de senha');
        }
      );
    } catch (error) {
      return response.status(error.status).send({
        error: { message: `Something didn't work out` },
      });
    }

    // return
  }

  async update({ request, response }) {
    try {
      const { token, password } = request.all();

      const user = await User.findByOrFail('token', token);

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at);

      if (tokenExpired) {
        return response.status(401).send({
          error: { message: `Token expired` },
        });
      }

      user.token = null;
      user.token_created_at = null;
      user.password = password;

      await user.save();
    } catch (error) {
      return response.status(error.status).send({
        error: { message: `Something didn't work out` },
      });
    }
  }
}

module.exports = ForgotPasswordController;
