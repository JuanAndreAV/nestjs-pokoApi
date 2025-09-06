import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';



@Module({
  imports: [ConfigModule.forRoot({
    load: [EnvConfiguration]
  }),
    ServeStaticModule.forRoot({rootPath: join(__dirname,'..','public'),}),
    MongooseModule.forRoot(process.env.MONGODB || "" ),
    PokemonModule,
    CommonModule,
    SeedModule
  ],
 
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    //console.log('MongoDB URI:', this.configService.get('MONGODB'));
  }
//  private readonly configService: ConfigService
  
}
