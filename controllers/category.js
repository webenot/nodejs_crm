'use strict';

const Category = require('../models/Category');
const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async (request, response) => {
  try {
    const categories = await Category.find({
      user: request.user.id,
    });
    response.status(200).json(categories);
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.getById = async (request, response) => {
  try {
    const category = await Category.findOne({
      _id: request.params.id,
      user: request.user.id,
    });
    response.status(200).json(category);
  } catch (error) {
    errorHandler(response, error);
  }
};

const path = require('path');
const fs = require('fs');

module.exports.delete = async (request, response) => {
  try {
    let category = await Category.findOne({
      _id: request.params.id,
      user: request.user.id,
    });

    if (!category) {
      response.status(404).json({
        message: 'Category does not exists'
      });
    }

    if (category.imageSrc) {
      const imagePath = path.resolve('./') + '/' + category.imageSrc;
      fs.unlinkSync(imagePath);
    }

    await Category.remove({
      _id: request.params.id,
      user: request.user.id,
    });

    await Position.remove({
      category: request.params.id,
      user: request.user.id,
    });

    response.status(200).json({
      message: 'Category has been removed',
    })
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.create = async (request, response) => {
  try {
    let category = await Category.findOne({
      name: request.body.name,
      user: request.user.id,
    });
    if (category) {
      response.status(409).json({
        message: 'Category with this name is already exists'
      });
    }

    category = await new Category({
      name: request.body.name,
      user: request.user.id,
      imageSrc: request.file ? request.file.path.replace(/\\/g, '/') : '',
    }).save();

    response.status(201).json(category);
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.patch = async (request, response) => {
  try {
    const updated = {
      name: request.body.name,
    };
    let category = await Category.findOne({
      _id: request.params.id,
      user: request.user.id,
    });

    if (!category) {
      response.status(404).json({
        message: 'Category does not exists'
      });
    }

    if (request.file) {
      updated.imageSrc = request.file.path.replace(/\\/g, '/');
      if (category.imageSrc) {
        const imagePath = path.resolve('./') + '/' + category.imageSrc;
        fs.unlinkSync(imagePath);
      }
    }

    category = await Category.findOneAndUpdate(
      { _id: request.params.id, },
      { $set: updated, },
      { new: true });
    response.status(200).json(category);
  } catch (error) {
    errorHandler(response, error);
  }
};
