const net = require('net');
// const Client = require('cgminer-api').client;

const host = '192.168.1.102';
const port = 4028;
// const cgminer = new Client({host, port});

// const command = 'stats';
const command = 'ascset';
const args = [0, 'fan-spd', '86-100'];

const parseStatsBuffer = (rawData) => {
  const object = JSON.parse(rawData
    .replace(/\-nan/g, '0')
    .replace(/[^\x00-\x7F]/g, '')
    .replace(/[^\}]+$/, ''));
  return object.STATS[0]['MM ID0'];
};

const main = async () => {
  const socket = await net.connect({host, port});
  let buffer = '';
  
  socket.on('data', (data) => {
    buffer += data.toString();
  });
  
  socket.on('end', () => {
    console.log(buffer);
  });

  await socket.write(JSON.stringify({ command, parameter: args.join(',')}));
};

main();