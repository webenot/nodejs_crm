'use strict';

module.exports.analytics = (request, response) => {
  response.status(200).json({
    analytics: 'From Controller'
  });
};

module.exports.overview = (request, response) => {
  response.status(200).json({
    overview: 'From Controller'
  });
};
