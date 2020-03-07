class ServiceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeOut = 30;
  }

  register({ serviceName, serviceVersion, serviceIp, servicePort }) {
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
      `Updated services ${serviceName}, version ${serviceVersion} at ${ip}:${servicePort}`
    );

    return key;
  }
}

module.exports = ServiceRegistry;
