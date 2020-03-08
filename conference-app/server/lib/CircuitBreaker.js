const axios = require('axios');

class CircuitBreaker {
  constructor() {
    this.states = {};
    this.failureThreshold = 5;
    this.coolDownPeriod = 10;
    this.requestTimeOut = 1;
  }

  initState(endpoint) {
    if (!this.states[endpoint]) {
      this.states[endpoint] = {
        failure: 0,
        coolDownPeriod: this.coolDownPeriod,
        circuit: 'CLOSED',
        nextTry: 0
      };
    }
  }

  onSuccess(endpoint) {
    this.initState(endpoint);
  }

  onFailure(endpoint) {
    const state = this.states[endpoint];
    state.failure += 1;

    if (state.failure > this.failureThreshold) {
      state.circuit = 'OPEN';
      state.nextTry = new Date() / 1000 + this.coolDownPeriod;
      // eslint-disable-next-line no-console
      console.log(
        `ALERT! circuit for ${endpoint} is in ${state.circuit} state`
      );
    }
  }

  canRequest(endpoint) {
    this.initState(endpoint);

    const state = this.states[endpoint];

    if (state.circuit === 'CLOSED') {
      return true;
    }

    const now = new Date() / 1000;

    if (state.nextTry <= now) {
      state.circuit = 'HALF';
      return true;
    }

    return false;
  }

  async callService(requestOptions) {
    if (!this.canRequest()) {
      return false;
    }

    const endpoint = `${requestOptions.method}:${requestOptions.url}`;

    try {
      const response = await axios({
        ...requestOptions,
        timeout: this.requestTimeOut * 1000
      });

      this.onSuccess(endpoint);

      return response;
    } catch (error) {
      this.onFailure(endpoint);
      return false;
    }
  }
}

module.exports = CircuitBreaker;
