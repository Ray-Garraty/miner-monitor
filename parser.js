/* eslint-disable no-control-regex */
import splitPVT from "./splitPVT.js";
import { readWeather } from './weather.js';

const convertBufferToObject = (rawData) => JSON.parse(rawData
    .replace(/-nan/g, '0')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^}]+$/, ''));

const extractStatsString = (object) => object[0]['MM ID0'];

const formatDataForLog = (data) => {
  const result = data
  .split('\nPVT_T1')[0]
  .split('TIMESTAMP;;;;;;;;;')[1]
  .replace(/;/g, ' ')
  .replace(/\n\n/g, '\n');
  return result;
};

const formatStatsString = async (logString) => {
  const outdoorTemp = await readWeather();
  const logArray = logString.split(']').map((entry) => entry.trim());
  
  const parseParameter = (parameterName) => {
    try {
      const [parameterString] = logArray.filter((element) => element.startsWith(parameterName));
      const result = parameterString.split('[');
      return result;
    }
    catch (error) {
      console.log('Проблема при парсинге параметра ', parameterName);
      console.log('Содержимое массива: ', logArray);
    }
  };

  const parameters = [
    'SYSTEMSTATU',
    'NETFAIL',
    'WORKMODE',
    'ADJ',
    'Freq',
    'Elapsed',
    'BOOTBY',
    'MH',
    'HW',
    'DH',
    'CRC',
    'Fan1',
    'Fan2',
    'Fan3',
    'Fan4',
    'FanR',
    'PS',
    'GHSmm',
    'GHSavg',
    'MGHS',
    'ECMM',
    'ECHU',
    'Temp',
    'TMax',
    'MTmax',
    'TAvg',
    'MTavg',
    'PVT_T1',
    'PVT_T2',
    'PVT_T0',
  ];

  const entries = parameters
    .map((parameter) => parseParameter(parameter));
  const [systemStatu] = entries.filter(([name,]) => name === "SYSTEMSTATU");
  const restOfEntries = entries.filter(([name,]) => name !== "SYSTEMSTATU");
  
  const splitSystemStatu = ([, value]) => {
    const [work, hashBoard] = value.split(',');
    return [[work, ''], hashBoard.trim().split(': ')];
  };

  const processedEntries = [...splitSystemStatu(systemStatu), ...restOfEntries];

  // console.log(processedEntries);

  const reducer = (acc, [name, value]) => {
    // console.log(name, value);
    if(name.startsWith('PVT_T')) {
      return [...acc, ...splitPVT(name, value)];
    }
    if(name.startsWith('BOOTBY')) {
      return [...acc, [name, value.slice(2, 4)]];
    }
    if(name.startsWith('DH') || name.startsWith('Freq')) {
      const n = value.slice(0, -1).replace('.', ',');
      return [...acc, [name, n]];
    }
    if(name.startsWith('FanR')) {
      const n = value.slice(0, -1);
      return [...acc, [name, n]];
    }
    if(name.startsWith('GHS') || name.startsWith('MGHS')) {
      const n = value.replace(/\./g, ',');
      return [...acc, [name, n]];
    }
    return [...acc, [name, value]];
  };

  const normalizedEntries = processedEntries
  .map(([name, value]) => name === 'Work' ? [name, value] : [name, value.trim().split(' ').filter(x => x).join(';')])
  .reduce(reducer, [])
  .map((entry) => entry.join(';'))
  .map((entry, i, array) => {
    if (array[i + 1] && array[i + 1].startsWith('Temp')) {
      return `${entry}\n\nOutdoorTemp;${outdoorTemp}`;
    }    
    if (!entry.startsWith('PVT_T') && array[i + 1].startsWith('PVT_T1')) {
      return `${entry}\n`;
    }
    if (entry.startsWith('PVT_T1') && array[i + 1].startsWith('PVT_T2')) {
      return `${entry}\n`;
    }
    if (entry.startsWith('PVT_T2') && array[i + 1].startsWith('PVT_T0')) {
      return `${entry}\n`;
    }
    return entry;
  });
  const [timeStamp] = (new Date).toString().split(' GMT');
  return [`TIMESTAMP;;;;;;;;;${timeStamp}`, ...normalizedEntries].join('\n');
};

export {
  convertBufferToObject,
  extractStatsString,
  formatStatsString,
  formatDataForLog,
};