import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PatientsModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
