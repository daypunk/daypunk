import 'dotenv/config'

const WEATHER_API_KEY = process.env.WEATHER_API_KEY

import fs from 'fs'
import got from 'got'
import Qty from 'js-quantities/esm'

let WEATHER_DOMAIN = 'http://dataservice.accuweather.com'

const emojis = {
  1: '☀️',
  2: '☀️',
  3: '🌤',
  4: '🌤',
  5: '🌤',
  6: '🌥',
  7: '☁️',
  8: '☁️',
  11: '🌫',
  12: '🌧',
  13: '🌦',
  14: '🌦',
  15: '⛈',
  16: '⛈',
  17: '🌦',
  18: '🌧',
  19: '🌨',
  20: '🌨',
  21: '🌨',
  22: '❄️',
  23: '❄️',
  24: '🌧',
  25: '🌧',
  26: '🌧',
  29: '🌧',
  30: '🥵',
  31: '🥶',
  32: '💨',
}



// 오늘 요일 정보
const today = new Date()
const todayDay = new Intl.DateTimeFormat('ko-KR', { 
  weekday: 'long',
  timeZone: 'Asia/Seoul'
}).format(today)

// 서울 실시간 날씨 정보
const locationKey = '226081'
let url = `currentconditions/v1/${locationKey}?apikey=${WEATHER_API_KEY}`

got(url, { prefixUrl: WEATHER_DOMAIN })
  .then((response) => {
    let json = JSON.parse(response.body)

    const degF = Math.round(json[0].Temperature.Imperial.Value)
    const degC = Math.round(Qty(`${degF} tempF`).to('tempC').scalar)
    const icon = json[0].WeatherIcon

    fs.readFile('template.svg', 'utf-8', (error, data) => {
      if (error) {
        return
      }

      data = data.replace('{degC}', degC)
      data = data.replace('{weatherEmoji}', emojis[icon])
      data = data.replace('{todayDay}', todayDay)

      data = fs.writeFile('chat.svg', data, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    })
  })
  .catch((err) => {
    // TODO: something better
    console.log(err)
  })
