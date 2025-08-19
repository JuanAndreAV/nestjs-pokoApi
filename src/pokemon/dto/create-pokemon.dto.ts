import {    IsInt, IsNumber, IsPositive, IsString, Min, MinLength} from 'class-validator';

export class CreatePokemonDto {
    
    @IsString()
    @MinLength(2)
    name: string

    
    @IsInt()
    @Min(1)
    @IsPositive()
    num: number;

}
