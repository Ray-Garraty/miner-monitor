import net from 'net';
import { convertBufferToObject } from './parser.js';
import { host, port } from './index.js';

const command = 'ascset';
// const args = [0, 'hashpower', 0];
const args = [0, 'fan-spd', '46-100'];

const main = async () => {
  const socket = await net.connect({host, port});
  let buffer = '';
  
  socket.on('data', (data) => {
    buffer += data.toString();
  });
  
  socket.on('end', async () => {
    const obj = convertBufferToObject(buffer);
    const { STATUS } = obj;
    const responseCode = STATUS[0].STATUS;
    const responseMessage = STATUS[0].Msg;
    if (responseCode === 'S' || responseCode === 'I') {
      console.log('Ответ майнера получен: ', responseMessage);
    } else {
      console.log('Ошибка запроса данных у майнера: ', responseMessage);
    }
  });
  await socket.write(JSON.stringify({ command, parameter: args.join(',')}));
};

main();