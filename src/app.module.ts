import { Module } from '@nestjs/common';
import { MealModule } from './modules/meal/meal.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),  // Accede a MONGO_URI usando ConfigService
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    } as MongooseModuleOptions),
    MealModule,
    AuthModule,
    SessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
