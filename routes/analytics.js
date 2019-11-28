'use strict';

const express = require('express');
const passport = require('passport');

const controller = require('../controllers/analytics');
const router = express.Router();

router.get('/analytics',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.analytics);
router.get('/overview',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.overview);

module.exports = router;
