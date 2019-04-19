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

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '47.103.1.31',
    }
  };

  config.logger = {
    dir: '/var/lib/jenkins/workspace/deploy_penda_node/log',
    outputJSON: true,
    level: 'DEBUG',
    allowDebugAtProd: true,
  };

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.cors = {
    // {string|Function} origin: '*',    
    origin: '*',
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
