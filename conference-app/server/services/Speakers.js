/* eslint-disable class-methods-use-this */
const axios = require('axios');
const url = require('url');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');

const CircuitBreaker = require('../lib/CircuitBreaker');

const circuitBreaker = new CircuitBreaker();
const fsExists = util.promisify(fs.exists);

class SpeakersService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.cache = {};
  }

  async getNames() {
    const { serviceIp, servicePort } = await this.getService(
      'speakers-service'
    );

    return this.callService({
      method: 'GET',
      url: `http://${serviceIp}:${servicePort}/names`
    });
  }

  async getListShort() {
    const { serviceIp, servicePort } = await this.getService(
      'speakers-service'
    );

    return this.callService({
      method: 'GET',
      url: `http://${serviceIp}:${servicePort}/list-short`
    });
  }

  async getList() {
    const { serviceIp, servicePort } = await this.getService(
      'speakers-service'
    );

    return this.callService({
      method: 'GET',
      url: `http://${serviceIp}:${servicePort}/list`
    });
  }

  async getAllArtwork() {
    const { serviceIp, servicePort } = await this.getService(
      'speakers-service'
    );

    return this.callService({
      method: 'GET',
      url: `http://${serviceIp}:${servicePort}/artwork`
    });
  }

  async getSpeaker(shortname) {
    const { serviceIp, servicePort } = await this.getService(
      'speakers-service'
    );

    return this.callService({
      method: 'GET',
      url: `http://${serviceIp}:${servicePort}/speaker/${shortname}`
    });
  }

  async getArtworkForSpeaker(shortname) {
    const { serviceIp, servicePort } = await this.getService(
      'speakers-service'
    );

    return this.callService({
      method: 'GET',
      url: `http://${serviceIp}:${servicePort}/artwork/${shortname}`
    });
  }

  async getImage(imgPath) {
    const { serviceIp, servicePort } = await this.getService(
      'speakers-service'
    );

    return this.callService({
      method: 'GET',
      responseType: 'stream',
      url: `http://${serviceIp}:${servicePort}/images/${imgPath}`
    });
  }

  async callService(requestOptions) {
    const servicePath = url.parse(requestOptions.url).path;

    const cacheKey = crypto
      .createHash('md5')
      .update(requestOptions.method + servicePath)
      .digest('hex');

    let cacheFile = null;

    if (
      // eslint-disable-next-line operator-linebreak
      requestOptions.responseType &&
      requestOptions.responseType === 'stream'
    ) {
      cacheFile = path.resolve(`${__dirname}/../../_imageCache/${cacheKey}`);
    }

    const result = circuitBreaker.callService(requestOptions);

    if (!result) {
      if (this.cache[cacheKey]) {
        return this.cache[cacheKey];
      }

      if (cacheFile) {
        const exists = await fsExists(cacheFile);
        if (exists) {
          return fs.createReadStream(cacheFile);
        }
      }

      return false;
    }

    if (!cacheFile) {
      this.cache[cacheKey] = result;
    } else {
      const ws = fs.createWriteStream(cacheFile);
      // result.data.pipe(ws);
    }

    return result;
  }

  async getService(serviceName) {
    const response = await axios.get(
      `${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersionIdentifier}`
    );
    return response.data;
  }
}

module.exports = SpeakersService;
