import axios from "axios";

const apiKey = process.env.Yandex_API_Key;
const latitude = process.env.latitude;
const longitude = process.env.longitude;

export default () => axios
  .get(`https://api.weather.yandex.ru/v2/forecast?lat=${latitude}&lon=${longitude}`, {
    headers: {
      'X-Yandex-API-Key': apiKey,
    }
  })
  .then((response) => {
    console.log('Погода с Яндекса получена');
    return response.data.fact.temp;
  })
  .catch((error) => {
    console.log('Ошибка при запросе погоды с Яндекса: ', error);
    return 99;
  });