import net from 'net';
import { convertBufferToObject, extractStatsString, formatStatsString } from './parser.js';

const host = '192.168.1.102';
const port = 4028;

const command = 'stats';
// const command = 'ascset';
const args = [0, 'fan-spd', '87-100'];

const main = async () => {
  const socket = await net.connect({host, port});
  let buffer = '';
  
  socket.on('data', (data) => {
    buffer += data.toString();
  });
  
  socket.on('end', () => {
    const obj = convertBufferToObject(buffer);
    const { STATUS, STATS } = obj;
    const responseCode = STATUS[0].STATUS;
    const responseMessage = STATUS[0].Msg;
    if (responseCode === 'S') {
      console.log('Успешно');
    } else {
      console.log('Произошла ошибка: ', responseMessage);
    };
    if (STATS) {
      const result = extractStatsString(STATS);
      console.log(result);
      // console.log(formatStatsString(result));
    }
  });

  await socket.write(JSON.stringify({ command, parameter: args.join(',')}));
};

main();