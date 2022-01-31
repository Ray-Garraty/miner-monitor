import fs from 'fs';
import net from 'net';
import { convertBufferToObject, extractStatsString, formatStatsString } from './parser.js';

const host = '192.168.1.102';
const port = 4028;
const interval = 1000;
const csvFilePath = 'C:/Users/vlbes/Desktop/log.csv';

const command = 'stats';
// const command = 'ascset';
const args = [0, 'fan-spd', '87-100'];

const isFileOpened = async (filepath) => {
  try {
    const fileHandle = await fs.promises.open(filepath, fs.constants.O_RDONLY | 0x10000000);
    fileHandle.close();
    return false;
  } catch (error) {
    if (error.code === 'EBUSY'){
      return true;
    } else {
      throw error;
    }
  }
};

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
      const isOpened = await isFileOpened(csvFilePath);
      console.log(isOpened);
      fs.writeFile(csvFilePath, formatStatsString(result), (err) => {
        if (err) {
          console.log('Ошибка записи лога в csv-файл: ', err);
        } else {
          console.log('Данные сохранены в csv-файл');
          setTimeout(() => main(), interval);
        }
      });
    }
  });

  await socket.write(JSON.stringify({ command, parameter: args.join(',')}));
};

main().then(setTimeout(() => main(), interval));
