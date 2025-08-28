import { Injectable } from '@nestjs/common';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { pokeResponse } from './interfaces/poke-response.interfaces';


@Injectable()
export class SeedService {
 constructor(
  @InjectModel(Pokemon.name) 
  private readonly pokemonModel: Model<Pokemon>,
  private readonly http: AxiosAdapter
){};

  //private readonly axios: AxiosInstance = axios
  async executeSeed() {
    await this.pokemonModel.deleteMany({}); //pera evitar error de registros duplicados en la bd

    //const { data } = await this.axios.get<pokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const data = await this.http.get<pokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    //const inrsertPromisesArray: {}[] = [];
    const pokemonToInsert: { name: string, num: number}[] = [];//manera recomendad
    data.results.forEach(async ({name, url})=>{
      const segments = url.split('/');
      const num: number = +segments[ segments.length - 2]
      //const pokemon = await this.pokemonModel.create({name, num})
      //inrsertPromisesArray.push(this.pokemonModel.create({name, num}))
       pokemonToInsert.push({name, num});
    });
    //await Promise.all( inrsertPromisesArray);
    this.pokemonModel.insertMany(pokemonToInsert);//manera recomendada.
    return 'seed ejecutado con éxito'
  }

  

  

}
