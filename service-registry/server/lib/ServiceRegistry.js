const semver = require('semver');

class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeOut = 30;
  }

  get(name, version) {
    this.cleanup();
    const candidates = Object.values(this.services).filter(
      (service) =>
        service.serviceName === name &&
        semver.satisfies(service.serviceVersion, version)
    );

    // Note: this candidates[Math.floor(Math.random() * candidates.length)]
    // mimic a load balance where the API version is randomly generated within
    // user requested version range
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  register({ serviceName, serviceVersion, serviceIp, servicePort }) {
    this.cleanup();
    const key = `${serviceName}${serviceVersion}${serviceIp}${servicePort}`;

    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].timeStamp = Math.floor(new Date() / 1000);
      this.services[key].serviceIp = serviceIp;
      this.services[key].serviceName = serviceName;
      this.services[key].serviceVersion = serviceVersion;
      this.log.debug(
        `Added services ${serviceName}, version ${serviceVersion} at ${serviceIp}:${servicePort}`
      );

      return key;
    }

    this.services[key].timeStamp = Math.floor(new Date() / 1000);
    this.log.debug(
      `Updated services ${serviceName}, version ${serviceVersion} at ${serviceIp}:${servicePort}`
    );

    return key;
  }

  unregister({ serviceName, serviceVersion, serviceIp, servicePort }) {
    const key = `${serviceName}${serviceVersion}${serviceIp}${servicePort}`;

    delete this.services[key];

    this.log.debug(
      `Unregistered services ${serviceName}, version ${serviceVersion} at ${serviceIp}:${servicePort}`
    );

    return key;
  }

  cleanup() {
    const now = Math.floor(new Date() / 1000);

    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timeStamp + this.timeOut < now) {
        delete this.services[key];
        this.log.debug(`Removed service ${key}`);
      }
    });
  }
}

module.exports = ServiceRegistry;
