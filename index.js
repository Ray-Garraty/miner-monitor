import fs from 'fs';
import net from 'net';
import { convertBufferToObject, extractStatsString, formatStatsString } from './parser.js';

const host = '192.168.1.102';
const port = 4028;
const interval = 600000;
const csvFilePath = 'C:/Users/vlbes/Desktop/log.csv';

const command = 'stats';
// const command = 'ascset';
const args = [0, 'fan-spd', '87-100'];

/* const isFileOpened = async (filepath) => {
  try {
    await fs.promises.rename(filepath, filePathNew);
    await fs.promises.rename(filePathNew, filepath);
    return false;
  } catch (error) {
    if (error.code === 'EBUSY'){
      return true;
    } else {
      throw error;
    }
  }
}; */

const main = async () => {
  const socket = await net.connect({host, port});
  let buffer = '';
  
  socket.on('data', (data) => {
    buffer += data.toString();
  });
  
  socket.on('end', async () => {
    const obj = convertBufferToObject(buffer);
    const { STATUS, STATS } = obj;
    const responseCode = STATUS[0].STATUS;
    const responseMessage = STATUS[0].Msg;
    if (responseCode === 'S') {
      console.log('Получен ответ от майнера');
    } else {
      console.log('Произошла ошибка: ', responseMessage);
    }
    if (STATS) {
      const result = extractStatsString(STATS);
      fs.writeFile(csvFilePath, formatStatsString(result), (err) => {
        if (err) {
          console.log('Ошибка записи лога в csv-файл: ', err);
        } else {
          console.log('Данные сохранены в csv-файл ', (new Date).toString().split('GMT')[0]);
          setTimeout(() => main(), interval);
        }
      });
    }
  });

  await socket.write(JSON.stringify({ command, parameter: args.join(',')}));
};

main().then(setTimeout(() => main(), interval));
