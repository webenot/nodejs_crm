'use strict';

const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async (request, response) => {
  // email password
  const candidate = await User.findOne({
    email: request.body.email,
  });

  if (candidate) {
    // Check password
    const passwordResult = bcryptjs.compareSync(request.body.password, candidate.password);

    if (passwordResult) {
      // Generate token, password correct
      const token = jsonwebtoken.sign({
          email: candidate.email,
          userId: candidate._id,
        },
        keys.secret,
        {
          expiresIn: 60 * 60
        });

      response.status(200).json({
        token: `Bearer ${token}`
      });
    } else {
      // Password is incorrect
      response.status(401).json({
        message: 'Password is incorrect. Try again'
      });
    }

  } else {
    // User not found, error
    response.status(404).json({
      message: 'User with this email not found'
    });
  }
};

module.exports.register = async (request, response) => {
  // email password
  const candidate = await User.findOne({
    email: request.body.email,
  });

  if (candidate) {
    // User exists, return error
    response.status(409).json({
      message: 'Email is already in use. Try other'
    });
  } else {
    // Need to create user
    const salt = bcryptjs.genSaltSync(10);
    const password = request.body.password;

    const user = new User({
      email: request.body.email,
      password: bcryptjs.hashSync(password, salt),
    });

    try {
      await user.save();
      response.status(201).json({
        message: `User with email ${request.body.email} created`
      });
    } catch (error) {
      // Handle error
      errorHandler(response, error);
    }
  }
};
