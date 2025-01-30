import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

class HistoryService {
  private async read():Promise<City[]> {
    const data = await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
    return JSON.parse(data);
  }

  private async write(cities: City[]):Promise<void> {
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  }

  async getCities():Promise<City[]> {
    try {
      const cities = await this.read();
      return cities;
    } catch (error) {
      throw new Error("cannot read from file: process in historyService")
    }
  }

  async addCity(city: string) {
    const cityArray = await this.getCities();
    const newCity:City = {
      id:uuidv4(),
      name:city
    }
    cityArray.push(newCity);
    await this.write(cityArray);
  }

  async deleteCity(id: string) {
    const cityId = id;
    let cityArray = await this.getCities();
    cityArray = cityArray.filter(city => city.id !== cityId);
    this.write(cityArray);
  }
}

export default new HistoryService();