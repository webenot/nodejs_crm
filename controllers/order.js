'use strict';

const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

// GET http://localhost:5000/api/order?page=2&limit=5
module.exports.getAll = async (request, response) => {
  try {
    let page = request.query.page ? +request.query.page : 1;
    let limit = request.query.limit ? +request.query.limit : 10;

    let offset = (page - 1) * limit;

    const query = {
      user: request.user.id,
    };

    if (request.query.start) {
      query.date = {
        $gte: request.query.start,
      }
    }

    if (request.query.end) {
      if (!query.date) {
        query.date = {};
      }
      query.date['$lte'] = new Date (+new Date(request.query.end) + 24 * 60 * 60 * 999);
    }

    if (request.query.order) {
      query.order = +request.query.order;
    }

    const orders = await Order.find(query)
      .sort({
        date: -1,
      })
      .skip(offset)
      .limit(limit);

    response.status(200).json(orders);

  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.getById = async (request, response) => {
  try {
    const order = await Order.findOne({
      _id: request.params.id,
      user: request.user.id,
    });
    response.status(200).json(order);
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.create = async (request, response) => {
  try {
    const lastOrder = await Order.findOne({
      user: request.user.id,
    }).sort({
      date: -1,
    });

    const maxOrderNumber = lastOrder ? lastOrder.order : 0;

    const order = await new Order({
      user: request.user.id,
      order: maxOrderNumber + 1,
      list: request.body.list,
    }).save();

    response.status(201).json(order);
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.update = async (request, response) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: request.params.id,
      },
      {
        $set: {
          list: request.body.list
        },
      },
      {
        new: true,
      }
    );

    response.status(200).json(order);
  } catch (error) {
    errorHandler(response, error);
  }
};
