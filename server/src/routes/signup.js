// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/', async (req, res) => {
       try {
              const { email, username, password } = req.body;
              let user = await User.findOne({ email });

              if (user) {
                     return res.status(400).json({ msg: 'Mail taken' });
              }
              user = await User.findOne({ username });

              if (user) {
                     return res.status(400).json({ msg: 'Username taken' });
              }

              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(password, salt);

              user = new User({
                     email,
                     username,
                     password: hashedPassword,
              });

              await user.save();

              // Exclude the password field from the response
              const responseUser = { email: user.email, username: user.username };

              res.json({ status: "success", msg: 'Account created', user: responseUser });
       } catch (error) {
              res.status(500).send('Internal error');
       }
});

module.exports = router;
