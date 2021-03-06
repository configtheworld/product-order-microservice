const express = require('express');
const User = require('./User');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

/**Ping
 * @desc test server is running
 * @exp res : pong
 */

router.get('/ping', (req, res) => {
  res.send('pong');
});

/**Sign Up / register
 * @desc new user registration
 * @res  operation status message
 */

router.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return res.json({ message: 'Mail Already Taken!' });
    } else {
      const hash = await bcrypt.hash(password, 10);
      const new_user = new User({
        name: name,
        email: email,
        password: hash,
      });
      new_user.save();
      return res.json({ message: 'User Successfully Registered!' });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: 'User could not registered!' });
  }
});

/**Login
 * @desc Login with validation
 * @res  access token
 */

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email && password) {
      const user = await User.findOne({ email: email });

      if (user) {
        const auth_check = await bcrypt.compare(password, user.password);

        if (auth_check) {
          const jwt_payload = {
            email,
            name: user.name,
          };

          const token = await jwt.sign(jwt_payload, '*ExperimentalSecretCode*');

          return res.json({
            message: 'Logged In Successfully!',
            token: token,
          });
        } else {
          return res.json({
            message: 'Wrong email or password!',
          });
        }
      } else {
        return res.json({ message: 'Wrong email or password!' });
      }
    }
  } catch (error) {
    return res.json({ message: 'Wrong email or password! Try Again!' });
  }
});

module.exports = router;
