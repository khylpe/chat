// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/', async (req, res) => {
       try {
              const { email, password } = req.body;

              console.log("received trying to login. On server side. emai: ", email, " password: ", password)
              let user = await User.findOne({ email });

              if (!user) {
                     return res.status(400).json({ msg: 'User does not exist.' });
              }
              const isMatch = await bcrypt.compare(password, user.password);

              if (!isMatch) {
                     return res.status(400).json({ msg: 'Incorrect password.' });
              }
              const userWithoutPassword = { ...user._doc };

              // delete sensitive data
              delete userWithoutPassword.password;
              delete userWithoutPassword._id;
              delete userWithoutPassword.__v;

              res.status(200).json({ msg: 'Connecté avec succès', user: userWithoutPassword });
       } catch (error) {
              res.status(500).send('Erreur du serveur');
       }
});

module.exports = router;
