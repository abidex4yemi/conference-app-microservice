/* eslint-disable class-methods-use-this */
const url = require('url');
const axios = require('axios');
const crypto = require('crypto');
const amqplib = require('amqplib');

const CircuitBreaker = require('../lib/CircuitBreaker');

const circuitBreaker = new CircuitBreaker();

class FeedbackService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.cache = {};
  }

  async getList() {
    const { serviceIp, servicePort } = await this.getService(
      'feedback-service'
    );

    return this.callService({
      method: 'get',
      url: `http://${serviceIp}:${servicePort}/list`
    });
  }

  async addEntry({ name, title, message }) {
    const q = 'feedback';

    const connection = await amqplib.connect('amqp://localhost');

    const channel = await connection.createChannel();

    await channel.assertQueue(q);

    const queueMessage = JSON.stringify({ name, title, message });

    return channel.sendToQueue(q, Buffer.from(queueMessage, 'utf-8'));
  }

  async callService(requestOptions) {
    const parsedUrl = url.parse(requestOptions.url);
    const cacheKey = crypto
      .createHash('md5')
      .update(requestOptions.method + parsedUrl.path)
      .digest('hex');

    const result = await circuitBreaker.callService(requestOptions);

    if (!result) {
      if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
      }
      return null;
    }

    this.cache[cacheKey] = result;

    this.cache[cacheKey] = result;
    return result;
  }

  async getService(serviceName) {
    const response = await axios.get(
      `${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersionIdentifier}`
    );
    return response.data;
  }
}

module.exports = FeedbackService;
