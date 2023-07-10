import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { PostsModule } from './posts/posts.module';
import { TherapistsModule } from './therapists/therapists.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PatientsModule, PostsModule, TherapistsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
