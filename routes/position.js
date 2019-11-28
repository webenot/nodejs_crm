'use strict';

const express = require('express');
const passport = require('passport');

const controller = require('../controllers/position');
const router = express.Router();

router.get('/:categoryId',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.getByCategoryId);
router.get('/:id',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.getById);
router.get('/',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.getAll);
router.post('/',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.create);
router.patch('/:id',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.update);
router.delete('/:id',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.delete);

module.exports = router;
