import fs from 'fs';
import net from 'net';
import {
  convertBufferToObject,
  extractStatsString,
  formatStatsString,
  formatDataForLog,
} from './parser.js';

const host = '192.168.1.102';
const port = 4028;
const interval = 600000;
const statsFilePath = 'C:/Users/vlbes/OneDrive/Майнинг/Avalon 1066/192.168.1.102_stats.csv';
const logFilePath = 'C:/Users/vlbes/OneDrive/Майнинг/Avalon 1066/192.168.1.102_logs.csv';
const logBlocksSeparator = ''.padEnd(25, '=');

const command = 'stats';
// const command = 'ascset';
const args = [0, 'fan-spd', '87-100'];

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
      console.log('Ответ майнера получен');
    } else {
      console.log('Ошибка запроса данных у майнера: ', responseMessage);
    }
    if (STATS) {
      const result = extractStatsString(STATS);
      const data = await formatStatsString(result);
      fs.writeFile(statsFilePath, data, (err) => {
        if (err) {
          console.log('Ошибка записи статистики в файл: ', err);
        } else {
          console.log((new Date).toString().split('GMT')[0]);
          console.log('Файл перезаписан:', statsFilePath);
          const logStream = fs.createWriteStream(logFilePath, {flags: 'a'});
          logStream.write(formatDataForLog(data));
          logStream.end(`${logBlocksSeparator}\n`);
          console.log('Данные добавлены в файл:', logFilePath);
          setTimeout(() => main(), interval);
        }
      });
    }
  });

  await socket.write(JSON.stringify({ command, parameter: args.join(',')}));
};

main().then(setTimeout(() => main(), interval));
