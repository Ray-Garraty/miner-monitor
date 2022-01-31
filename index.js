const Client = require('cgminer-api').client;

const host = '192.168.1.104';
const port = 4028;
const cgminer = new Client({host, port});

const command = {name: 'stats', reply: 'ололо'};
// const command = {name: 'ascset'};
const args = [0, 'fans-spd', '86-100'];

const main = async () => {
  await cgminer.connect();
  await cgminer.request(command, args);
  // console.log(command);
};

main();