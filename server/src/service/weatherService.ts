import dayjs, { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

class WeatherService {

  private apiKey?: string;

  private baseURL?: string;

  constructor() {

    this.apiKey = '1fff98e1ebfda2ef1f67a677c72c8f86'

    this.baseURL = 'https://api.openweathermap.org'

  }

  private async fetchWeatherData(query: string) {
    const response = await fetch(query);
    try {

      if (response.ok) {
        return await response.json();
      }

    } catch (error) {
      console.error('Oops! There was an error...' + error);
    }
  }

  private async destructureLocationData(locationData: Coordinates): Promise<Weather[]> {

    const { lat, lon }: Coordinates = locationData;
    const forecastUrl = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;
    const data = await this.fetchWeatherData(forecastUrl);
    return this.parsedWeather(data);

  }

  private parseCurrentWeather(data: any): Weather[] {
    try {

      const city = data.name;
      const unixDate = data.dt;
      const date = dayjs.unix(unixDate).format(`YYYY-MM-DD`);
      const tempF = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
      const icon = data.weather[0].icon;
      const iconDescription = data.weather[0].description;

      const currentWeatherDataArr: Weather[] = []

      const currentWeatherForecast: Weather = {
        city,
        date,
        tempF,
        windSpeed,
        humidity,
        icon,
        iconDescription
      }

      currentWeatherDataArr.push(currentWeatherForecast);

      return currentWeatherDataArr;

    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private parsedWeather(data: any): Weather[] {

    try {

      const city = data.city.name;
      const forecastWeatherDataArray: Weather[] = [];

      for (let i = 4; i < data.cnt; i = i + 8) {
        const tempF = data.list[i].main.temp;
        const humidity = data.list[i].main.humidity;
        const unixDate = data.list[i].dt;
        const date = dayjs.unix(unixDate).format(`YYYY-MM-DD`);
        const icon = data.list[i].weather[0].icon;
        const iconDescription = data.list[i].weather[0].description;
        const windSpeed = data.list[i].wind.speed;

        const forecastWeatherData: Weather = {

          city,
          date,
          tempF,
          windSpeed,
          humidity,
          icon,
          iconDescription
        }
        forecastWeatherDataArray.push(forecastWeatherData);
      }
      return forecastWeatherDataArray;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    const response = await fetch(`${this.baseURL}/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=imperial`)

    if (response.ok) {

      const data = await response.json();
      const coord = {
        lat: data.coord.lat,
        lon: data.coord.lon,
      }

      const forecastWeatherArray = await this.destructureLocationData(coord);
      const currentWeatherArray = this.parseCurrentWeather(data);
      const totalWeatherArray = [...currentWeatherArray, ...forecastWeatherArray];
      return totalWeatherArray;

    } else {
      console.error("City name was not found... Please try again!");
      return [];
    }
  }
}

export default new WeatherService();
