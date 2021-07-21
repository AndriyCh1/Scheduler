import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from 'src/entities/task.entity';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';

@Module({
  imports:[TypeOrmModule.forFeature([TaskEntity])],
  controllers: [SchedulerController],
  providers: [SchedulerService]
})

export class SchedulerModule {
  // constructor(private readonly schedulerService: SchedulerService ){}
}
