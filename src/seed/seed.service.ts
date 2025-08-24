import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance } from 'axios';
import { pokeResponse } from './interfaces/poke-response.interfaces';


@Injectable()
export class SeedService {
 
  private readonly axios: AxiosInstance = axios
  async executeSeed() {
    const { data } = await this.axios.get<pokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    data.results.forEach(({name, url})=>{
      const segments = url.split('/');
      const num: number = +segments[ segments.length - 2]
        console.log({name, num})
    })
    return data.results
  }

  

  

}
