import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(@InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon> ) {}
    
  
  async create(createPokemonDto: CreatePokemonDto) {
    
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
       const createPokemon =  new this.pokemonModel(createPokemonDto)
        return await createPokemon.save();
    } catch (error) {
      this.handleExceptions(error)
    }
   
  }

  async findAll() {

    return this.pokemonModel.find();
  }

 async findOne(term: string) {
   let pokemon   ;
   if(!isNaN(Number(term))){
    pokemon = await this.pokemonModel.findOne({ num: term });
   };
   if(!pokemon && isValidObjectId(term)){
      pokemon = await this.pokemonModel.findById(term)
   };
   if(!pokemon){
    pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() });
   }
   if(!pokemon) throw new NotFoundException(`Pokemon con id: ${term}, no encontrado.`)

   
   return pokemon 
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase()
      try {
        
      await pokemon.updateOne(updatePokemonDto)
      return {
        ...pokemon.toJSON(),
        ...updatePokemonDto
      }

      } catch (error) {
       this.handleExceptions(error)
    }
    
      
    }
    
  }

async  remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne()
    //const result = await this.pokemonModel.findByIdAndDelete(id)
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id})
    if(deletedCount === 0) throw new BadRequestException(`Pokemon with id: ${id} not found`)
    return;
  }

  private handleExceptions(error: any){
    if(error.code === 11000){
        throw new BadRequestException(`Este pokemon ya existe en db ${JSON.stringify(error.keyValue)}`)
      }
      console.log(error)
      throw new InternalServerErrorException('Can not create a Pokemon')
  }

  async pokeSeed(createPokemonDto: CreatePokemonDto){
    await this.create(createPokemonDto);
  }
}
