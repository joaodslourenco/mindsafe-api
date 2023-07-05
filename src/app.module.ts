import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { PostsModule } from './posts/posts.module';
import { TherapistsModule } from './therapists/therapists.module';

@Module({
  imports: [PatientsModule, PostsModule, TherapistsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
