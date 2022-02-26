import fs from 'fs';
import net from 'net';
import process from 'process';
import { port, updateInterval } from './variables.js';
import {
  convertBufferToObject,
  extractStatsString,
  formatStatsString,
  formatDataForLog,
} from './parser.js';

const logstats = async (hostIP) => {
  const logBlocksSeparator = ''.padEnd(25, '=');
  const folderPath = process.env.LOCAL_GDRIVE_PATH;
  const command = 'stats';  
  const statsFilePath = `${folderPath}${hostIP}_stats.csv`;
  const logFilePath = `${folderPath}${hostIP}_logs.txt`;
  let socket;
  try {
    socket = await net.connect({host: hostIP, port});
  } catch (err) {
    console.log('Ошибка подключения к IP ', hostIP, err);
    logstats(hostIP);
  }
  let buffer = '';
  
  socket.on('data', (data) => {
    buffer += data.toString();
  });
  
  socket.on('end', async () => {
    const obj = convertBufferToObject(buffer);
    const { STATUS, STATS } = obj;
    const responseCode = STATUS[0].STATUS;
    const responseMessage = STATUS[0].Msg;
    if (responseCode === 'S' || responseCode === 'I') {
      console.log('Ответ майнера', hostIP,'получен');
    } else {
      console.log('Ошибка запроса данных у майнера: ', hostIP, responseMessage);
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
          setTimeout(() => logstats(hostIP), updateInterval);
        }
      });
    }
  });

  await socket.write(JSON.stringify({ command }));
};

export default logstats;