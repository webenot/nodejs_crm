'use strict';

const moment = require('moment');

const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

module.exports.analytics = async (request, response) => {
  try {
    const allOrders = await Order.find({
      user: request.user._id
    }).sort({ date: 1 });

    const ordersMap = getOrdersMap(allOrders);

    const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

    const chart = Object.keys(ordersMap).map(label => {
      const gain = calculatePrice(ordersMap[label]);
      const order = ordersMap[label].length;
      return { label, gain, order };
    });

    response.status(200).json({ average, chart });
  } catch (error) {
    errorHandler(response, error);
  }
};

module.exports.overview = async (request, response) => {
  try {
    const date = new Date();
    const allOrders = await Order.find({
      user: request.user._id,
      date: {
        $lte: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
      }
    }).sort({ date: 1 });

    const ordersMap = getOrdersMap(allOrders);

    const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];
    const yesterdayOrdersCount = yesterdayOrders.length;

    // Orders count
    const totalOrders = allOrders.length;

    // Days count
    const totalDays = Object.keys(ordersMap).length;

    // Orders per day
    const ordersPerDay = (totalOrders / totalDays).toFixed(0);

    // Orders count percent
    // ((ordersBefore / ordersPerDay) - 1) * 100
    const ordersCountPercent = ((yesterdayOrdersCount / ordersPerDay - 1) * 100).toFixed(2);

    // Total gain
    const totalGain = calculatePrice(allOrders).toFixed(2);

    // Gain per day
    const gainPerDay = (totalGain / totalDays).toFixed(2);

    // Yesterday gain
    const yesterdayGain = calculatePrice(yesterdayOrders);

    // Gain percents
    const gainPercent = ((yesterdayGain / gainPerDay - 1) * 100).toFixed(2);

    // Gain comparison
    const gainComparison = (yesterdayGain - gainPerDay).toFixed(2);

    // Orders count comparison
    const ordersCountComparison = (yesterdayOrdersCount - ordersPerDay).toFixed(0);

    response.status(200).json({
      gain: {
        percent: Math.abs(+gainPercent),
        compare: Math.abs(+gainComparison),
        yesterday: +yesterdayGain,
        isHigher: +gainPercent > 0,
      },
      orders: {
        percent: Math.abs(+ordersCountPercent),
        compare: Math.abs(+ordersCountComparison),
        yesterday: +yesterdayOrdersCount,
        isHigher: +ordersCountPercent > 0,
      }
    });

  } catch (error) {
    errorHandler(response, error);
  }
};

function getOrdersMap(orders = []) {
  const daysOrder = {};

  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY');
    if (!daysOrder[date]) {
      daysOrder[date] = [];
    }
    daysOrder[date].push(order);
  });

  return daysOrder;
}

function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const oneOrderPrice = order.list.reduce((price, item) => {
      return item.cost * item.quantity + price;
    }, 0);

    return oneOrderPrice + total;
  }, 0);
}
