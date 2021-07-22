import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskDto } from 'src/dto/tasks.dto';
import { TaskEntity } from 'src/entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SchedulerService {
    
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>
    ) {}
    
    async createTask(task: TaskDto): Promise<TaskDto>{
        return await this.taskRepository.save(task);
    }
    
    async findAllTasks(): Promise<TaskDto[]>{
        return await this.taskRepository.find({ order:{ time:"ASC"}  });
    }

    async findTaskById(id: string): Promise<TaskDto>{
        return await this.taskRepository.findOne(id);
    }

    async findAllTasksByDate(date: string): Promise<TaskDto[]>{
        return await this.taskRepository.find({
                order:{
                    time:"ASC"
                },
                where:{
                    date: date
                }
            }
        );
    }

    async updateTask(id: number, task: TaskDto): Promise<void>{
        await this.taskRepository.update(id, task);
        
        // const taskRow = await this.taskRepository.findOne(id);
        // if (taskRow){
        //     taskRow.description = task.description;
        //     await this.taskRepository.save(taskRow); 
        // }
    }

    async deleteTask(id: number): Promise<void>{
        await this.taskRepository.delete(id);
    }
}
