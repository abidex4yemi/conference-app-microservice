/* eslint-disable class-methods-use-this */
const axios = require('axios');

class SpeakersService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
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

  async getImage(path) {
    const { serviceIp, servicePort } = await this.getService(
      'speakers-service'
    );

    return this.callService({
      method: 'GET',
      responseType: 'stream',
      url: `http://${serviceIp}:${servicePort}/images/${path}`
    });
  }

  async callService(requestOptions) {
    const response = await axios(requestOptions);
    return response;
  }

  async getService(serviceName) {
    const response = await axios.get(
      `${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersionIdentifier}`
    );
    return response.data;
  }
}

module.exports = SpeakersService;
