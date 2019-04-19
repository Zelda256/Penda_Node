/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
 * built-in config
 * @type {Egg.EggAppConfig}
 **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1554273891258_9652';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.cors = {
    // origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true,

  };
  config.security = {
    csrf: false
  },

  // mongo config
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/penda',
      options: {},
    },
  };

  // passport-local
  config.auth_cookie_name = 'penda';

  return {
    ...config,
    ...userConfig,
  };
};
