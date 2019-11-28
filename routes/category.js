'use strict';

const express = require('express');
const passport = require('passport');

const upload = require('../middlware/upload');
const controller = require('../controllers/category');
const router = express.Router();

router.get(
  '/',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.getAll
);
router.get('/:id',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.getById);
router.delete('/:id',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  controller.delete);
router.post('/',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  upload.single('image'),
  controller.create);
router.patch('/:id',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  upload.single('image'),
  controller.patch);

module.exports = router;
