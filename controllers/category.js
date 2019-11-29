'use strict';

const Category = require('../models/Category');
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

module.exports.delete = async (request, response) => {
  try {
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
    const category = await new Category({
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
    if (request.file) {
      updated.imageSrc = request.file.path.replace(/\\/g, '/');
    }
    const category = await Category.findOneAndUpdate(
      { _id: request.params.id, },
      { $set: updated, },
      { new: true });
    response.status(200).json(category);
  } catch (error) {
    errorHandler(response, error);
  }
};
