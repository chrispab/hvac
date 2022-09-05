/*
 * Sensor responsible for reading the temperature sensor
 */
const mqtt = require('mqtt');
const moment = require('moment');

const log = require('./log');
const config = require('./config');

// const subtopic = '433Bridge/Temperature';
// const subtopic = '433Bridge/*';
const subtopic = 'Zone3/#';

const transmitter = {};
transmitter.client = mqtt.connect();

transmitter.connect = function connect(cb) {
  const connectOptions = {
    port: config.mqtt.port,
    host: config.mqtt.broker,
    rejectUnauthorized: false,
    protocol: 'mqtt',
    // username: config.mqtt.username,
    // password: config.mqtt.password,
  };

  log.info(`Trying to connect to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`);

  transmitter.client = mqtt.connect(connectOptions);

  transmitter.client.on('connect', () => {
    log.info(`Connected successfully to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`);
    transmitter.client.subscribe([subtopic], () => {
      log.info(`Subscribed to topic '${subtopic}'`);
    });
    cb();
  });

  transmitter.client.on('error', (err) => {
    log.error(`An error occurred. ${err}`);
  });

  transmitter.client.on('message', (topic, payload) => {
    // log.debug(`Rxd Message: ${topic}: ${payload.toString()}`);
    // console.log('Received Message:', topic, payload.toString());
    transmitter.messageHandler(topic, payload);
  });
};
transmitter.messageHandler = function send(topic, payload) {
  // const message = {
  //   temperature,
  //   timeStamp: moment().unix(),
  // };
  // let newtopic;
  // log.debug(`IN Received Message handler:- ${topic}: ${payload.toString()}`);
  // replace Zone3 with config.zone.name
  const newtopic = topic.replace('Zone3', config.zone.name);

  transmitter.client.publish(newtopic, payload, (err) => {
    if (err) {
      log.error(`An error occurred while trying to publish a message. Err: ${err}`);
    } else {
      // log.debug(`Rxd Message mod: ${newtopic}: ${payload.toString()}`);
      // log.debug('mod and forward message');
    }
    // cb(err);
  });
};

transmitter.send = function send(temperature, cb) {
  const message = {
    temperature,
    timeStamp: moment().unix(),
  };

  transmitter.client.publish(config.mqtt.topic, JSON.stringify(message), (err) => {
    if (err) {
      log.error(`An error occurred while trying to publish a message. Err: ${err}`);
    } else {
      log.debug('Successfully published message');
    }
    cb(err);
  });
};

transmitter.disconnect = function disconnect(cb) {
  transmitter.client.end();
  cb();
};

module.exports = transmitter;
