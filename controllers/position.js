'use strict';

const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');

module.exports.getAll = async (request, response) => {
  try {
    const positions = await Position.find({
      user: request.user.id,
    });
    response.status(200).json(positions);
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.getByCategoryId = async (request, response) => {
  try {
    const positions = await Position.find({
      category: request.params.categoryId,
      user: request.user.id,
    });
    response.status(200).json(positions);
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.getById = async (request, response) => {
  try {

  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.create = async (request, response) => {
  try {
    let position = await Position.findOne({
      name: request.body.name,
      user: request.user.id,
      category: request.body.category,
    });
    if (position) {
      response.status(409).json({
        message: 'Position with this name is already exists'
      });
    }

    position = await new Position({
      name: request.body.name,
      cost: request.body.cost,
      category: request.body.category,
      user: request.user.id,
    }).save();
    response.status(201).json(position);
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.update = async (request, response) => {
  try {
    const position = await Position.findOneAndUpdate(
      {
        _id: request.params.id,
      },
      {
        $set: request.body,
      },
      {
        new: true,
      }
    );
    response.status(200).json(position);
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.delete = async (request, response) => {
  try {
    await Position.remove({
      _id: request.params.id,
      user: request.user.id,
    });
    response.status(200).json({
      message: 'Position has been removed',
    })
  } catch (error) {
    errorHandler(response, error);
  }
};
