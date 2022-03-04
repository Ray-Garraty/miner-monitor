import fs from 'fs';
import axios from "axios";
import process from 'process';
import { weatherUpdateInterval } from './variables.js';

const apiKey = process.env.Yandex_API_Key;
const latitude = process.env.latitude;
const longitude = process.env.longitude;
const folderPath = process.env.LOCAL_GDRIVE_PATH;
const weatherFilePath = `${folderPath}weather.txt`;

const saveWeather = () => axios.get(`https://api.weather.yandex.ru/v2/informers?lat=${latitude}&lon=${longitude}`, {
    headers: { 'X-Yandex-API-Key': apiKey }
  })
  .then((response) => {
    console.log('\nПогода с Яндекса получена');
    const currentTemp = response.data.fact.temp; 
    const [timeStamp] = (new Date).toString().split(' GMT');
    fs.writeFile(weatherFilePath, `${timeStamp}\n${currentTemp}`, 'utf-8', () => {
      console.log('Температура записана в файл', weatherFilePath);
    });
  })
  .catch((error) => {
    console.log('\nОшибка при запросе погоды с Яндекса: ', error.message);
  })
  .finally(() => {
    setTimeout(() => saveWeather(), weatherUpdateInterval);
  });

const readWeather = () => {
  const data = fs.readFileSync(weatherFilePath, 'utf-8');
  const [, temperature] = data.split('\n');
  return temperature;
};

export { saveWeather, readWeather };