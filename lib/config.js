/*
 * Create and export configuration variables
 *
 */
const constants = require('./constants');

// Container for all environments
const environments = {};

environments.production = {
  mqtt: {
    broker: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
    topic: 'house/bedroom/temperature',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  },
  envName: constants.ENVIRONMENTS.PRODUCTION,
  log: {
    level: process.env.LOG_LEVEL,
  },
  measurement: {
    readInterval: 1,
  },
  zone: {
    name: 'Zone_Dev',
  },
  pins: {
    LDRPin: 27, // phys pin 11
  },
  logic: {
    OFF: 0,
    ON: 1,
  },
};

environments.development = {
  mqtt: {
    broker: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
    topic: '__test_1/bedroom/temperature',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  },
  envName: constants.ENVIRONMENTS.DEVELOPMENT,
  log: {
    level: process.env.LOG_LEVEL,
  },
  measurement: {
    readInterval: 1,
  },
  zone: {
    name: 'Zone_Dev',
  },
  hardware: {
    platform: 'raspberrypi',
  },
  pins: {
    LightControlPin: 'notImplemented',
    LDRPin: 27, // phys pin 11
  },
  logic: {
    OFF: 0,
    ON: 1,
  },
};

// Determine which environment was passed as a command-line argument
// currentEnvironment resolves as either 'production' or 'development' - lower case version of
// whatever "NODE_ENV=" is in .env file

const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment defined above,
// if not default to production
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.production;

// export the module
module.exports = environmentToExport;

exports.logic = environmentToExport.logic;
