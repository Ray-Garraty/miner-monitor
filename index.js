import logstats from './logstats.js';
import { hostsIPs } from './variables.js';
import { saveWeather } from './weather.js';

const main = async () => {
  await saveWeather();
  Promise.all([hostsIPs.map((ip) => logstats(ip))]);
};

main();